import crypto from 'crypto';

import {
  createCookie,
  createCookieSessionStorage,
  json,
  Session,
} from '@remix-run/node';
import { TypedResponse } from '@remix-run/server-runtime';

import { ObjectOf } from '~/src/types/generic';
import {
  API_AUTH,
  Authentication,
  JwtPayload,
  Methods,
  SessionWrapper,
} from '~/src/utils/api';

export const COOKIE_NAME = '__session';
export const AUTH_CALLBACK_ROUTE = '/auth/login';
export const REDIRECT_URI = process.env.REDIRECT_URI;

export interface State {
  redirectTo: string;
}

export const parseSessionHolder = (session: Session): Authentication =>
  decrypt<Authentication>(session.get(COOKIE_NAME));

// export the whole sessionStorage object
const unsecureCookies =
  process.env.UNSECURE_COOKIES === 'true' ||
  process.env.UNSECURE_COOKIES === '1';
if (unsecureCookies) {
  console.info('Load session storage with unsecure cookies');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: createCookie(COOKIE_NAME, {
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: !unsecureCookies, // for security reasons, make this cookie http only
    secrets: [process.env.CLIENT_SECRET || 'secret'], // replace this with an actual secret
    secure: !unsecureCookies,
  }),
});

export const encrypt = (payload: Authentication): string => {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
  const iv = process.env.ENCRYPTION_IV!;

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
};

export const decrypt = <T>(cookie: string): T => {
  if (cookie) {
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
    const iv = process.env.ENCRYPTION_IV!;
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = decipher.update(cookie, 'base64', 'utf8');
    const final = decrypted + decipher.final('utf8');

    return JSON.parse(final);
  }

  return { refresh_token: undefined } as T;
};

export interface OpenIdConfiguration {
  authorization_endpoint: string;
  userinfo_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  introspection_endpoint: string;
}

export const getOpenIdConfig = async (): Promise<OpenIdConfiguration> => {
  const uri = `${process.env.API_URL}${API_AUTH}/.well-known/openid-configuration`;

  return fetch(uri)
    .catch(() => {
      throw new Error('Error while fetching openid config');
    })
    .then(async (response) => response.json());
};

export const getJwtPayload = (
  decryptedCookie: Authentication
): JwtPayload | undefined =>
  JSON.parse(
    Buffer.from(decryptedCookie.access_token.split('.')[1], 'base64').toString()
  );

export const exchangeToken = async (
  openIdConfig: ObjectOf<any>,
  code: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}${AUTH_CALLBACK_ROUTE}`;

  return await fetch(uri).then(async (response) => {
    if (response.status != 200) {
      throw new Error('Error while exchanging token');
    }

    return response.json();
  });
};

export const refreshToken = async (
  openIdConfig: OpenIdConfiguration,
  refreshToken: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${refreshToken}`;

  return fetch(uri, {
    method: 'POST',
  }).then(async (response) => {
    if (response.status != 200) {
      throw new Error('Error while refreshing access token');
    }

    return await response.json();
  });
};

export const introspect = async (
  openIdConfig: OpenIdConfiguration,
  accessToken: string
): Promise<{ active: boolean }> => {
  const auth = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const buff = new Buffer(auth);
  const basic = buff.toString('base64');
  const data = new FormData();
  data.append('token', accessToken || '');

  return fetch(openIdConfig.introspection_endpoint, {
    headers: { Authorization: `Basic ${basic}` },
    method: Methods.POST,
    body: data,
  }).then(async (response) => {
    if (response.status != 200) {
      throw new Error('Error while instrospecting access token');
    }

    return await response.json();
  });
};

export const handleResponse = async (
  data: SessionWrapper
): Promise<TypedResponse<any>> => json(data.callbackResult);

export const withSession = async (
  request: Request,
  callback: (session: Session) => any
): Promise<SessionWrapper> => {
  const session = await getSession(request.headers.get('Cookie'));
  const c = await callback(session);

  return {
    callbackResult: c,
  };
};

export const { getSession, destroySession, commitSession } = sessionStorage;
