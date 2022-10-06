import crypto from 'crypto';

import { createCookieSessionStorage, json, Session } from '@remix-run/node';
import { TypedResponse } from '@remix-run/server-runtime';

import { ObjectOf } from '~/src/types/generic';
import {
  API_AUTH,
  Authentication,
  JwtPayload,
  logger,
  returnHandler,
  SessionWrapper,
} from '~/src/utils/api';

export const COOKIE_NAME = 'auth_session';
export const AUTH_CALLBACK_ROUTE = '/auth/login';
const FROM = 'utils/auth.server';

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: COOKIE_NAME, // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.CLIENT_SECRET || 'secret'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production',
  },
});

export const encrypt = (payload: Authentication): string | undefined => {
  try {
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
    const iv = process.env.ENCRYPTION_IV!;

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
  } catch (e) {
    logger(e, FROM);

    return undefined;
  }
};

export const decrypt = (cookie: string): Authentication | undefined => {
  try {
    if (cookie) {
      const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
      const iv = process.env.ENCRYPTION_IV!;
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      const decrypted = decipher.update(cookie, 'base64', 'utf8');

      return JSON.parse(decrypted + decipher.final('utf8'));
    }

    return {} as any;
  } catch (e) {
    logger(e, FROM);

    return undefined;
  }
};

export const getOpenIdConfig = async (): Promise<undefined | ObjectOf<any>> => {
  const uri = `${process.env.API_URL}${API_AUTH}/.well-known/openid-configuration`;
  const openIdConfig = await fetch(uri);

  return await returnHandler<ObjectOf<any>>(openIdConfig, FROM);
};

export const getJwtPayload = (
  decryptedCookie: Authentication
): JwtPayload | undefined => {
  try {
    JSON.parse(
      Buffer.from(
        decryptedCookie.access_token.split('.')[1],
        'base64'
      ).toString()
    );
  } catch (e) {
    logger(e, 'utils/auth.server');

    return undefined;
  }
};

export const authenticate = async (
  openIdConfig: ObjectOf<any>,
  code: string,
  url: URL
): Promise<undefined | Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${url.origin}${AUTH_CALLBACK_ROUTE}`;
  const auth = await fetch(uri);

  return await returnHandler<Authentication>(auth, FROM);
};

export const refreshToken = async (
  openIdConfig: ObjectOf<any>,
  cookie: ObjectOf<any>
): Promise<Authentication | undefined> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${cookie.refresh_token}`;
  const refresh = await fetch(uri);

  return await returnHandler<Authentication>(refresh, FROM);
};

export const handleResponse = async (
  data: SessionWrapper
): Promise<TypedResponse<any>> =>
  json(data.callbackResult, {
    headers: {
      'Set-Cookie': await data.sessionHandler,
    },
  });

export const withSession = async (
  request: Request,
  callback: (session: Session) => any
): Promise<SessionWrapper> => {
  const session = await getSession(request.headers.get('Cookie'));
  console.log(
    'Session seems not up to date, despite refresh',
    decrypt(session.get(COOKIE_NAME))
  );
  const commitSession = sessionStorage.commitSession(session);
  try {
    const c = await callback(session);

    return {
      sessionHandler: commitSession,
      callbackResult: c,
    };
  } catch (e) {
    // TODO uncomment when ready
    // if (e instanceof RefreshingTokenError) {
    //   const destroySession = sessionStorage.destroySession(session);
    //
    //   return { sessionHandler: destroySession, callbackResult: {} };
    // }

    return { sessionHandler: commitSession, callbackResult: {} };
  }
};

export const { getSession, destroySession, commitSession } = sessionStorage;

export class UnauthenticatedError extends Error {
  constructor() {
    super('Unauthenticated');
  }
}

export class RefreshingTokenError extends Error {
  constructor() {
    super('Error while refreshing access token');
  }
}
