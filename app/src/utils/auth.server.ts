import crypto from 'crypto';

import { createCookieSessionStorage, Session } from '@remix-run/node';
import { TypedResponse } from '@remix-run/server-runtime';
import dayjs from 'dayjs';
import { json, redirect } from 'remix';

import { ObjectOf } from '~/src/types/generic';
import { API_AUTH } from '~/src/utils/api.server';

export const COOKIE_NAME = 'auth_session';
export const AUTH_CALLBACK_ROUTE = '/auth/login';

export type SessionWrapper = { commitSession: string; callbackResult: any };
export type CurrentUser = {
  sub: string;
  scp: string[];
  email: string;
  email_verified: boolean;
};
export type Authentication = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id_token: string;
};
export type JwtPayload = {
  sub: string;
  aud: string[];
  jti: string;
  exp: number;
  iat: number;
  nbf: number;
  scp?: string[]; // TODO make it required once permissions from backend are set
};

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: COOKIE_NAME, // use any name you want here
    sameSite: 'none', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.CLIENT_SECRET || 'secret'], // replace this with an actual secret
    secure: true, // enable this in prod only
  },
});

export const encrypt = (payload: Authentication) => {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
  const iv = process.env.ENCRYPTION_IV!;

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
};

export const decrypt = (cookie: string): Authentication => {
  if (cookie) {
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
    const iv = process.env.ENCRYPTION_IV!;
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = decipher.update(cookie, 'base64', 'utf8');

    return JSON.parse(decrypted + decipher.final('utf8'));
  }

  return {} as any;
};

export const getOpenIdConfig = async (): Promise<ObjectOf<any>> => {
  const openIdConfig = await fetch(
    `${process.env.API_URL_BACK}${API_AUTH}/.well-known/openid-configuration`
  );

  return await openIdConfig.json();
};

export const getJwtPayload = (decryptedCookie: Authentication): JwtPayload =>
  JSON.parse(
    Buffer.from(decryptedCookie.access_token.split('.')[1], 'base64').toString()
  );

export const authenticate = async (
  openIdConfig: ObjectOf<any>,
  code: string,
  url: URL
): Promise<Authentication> => {
  const auth = await fetch(
    `${openIdConfig.token_endpoint}?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${url.origin}${AUTH_CALLBACK_ROUTE}`
  );

  return await auth.json();
};

export const refreshToken = async (
  openIdConfig: ObjectOf<any>,
  cookie: ObjectOf<any>
): Promise<Response> =>
  await fetch(
    `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${cookie.refresh_token}`
  );

export const endSession = async (
  openIdConfig: ObjectOf<any>,
  // url: URL,
  cookie: ObjectOf<any>
): Promise<Response> =>
  redirect(
    `${openIdConfig.end_session_endpoint}?id_token_hint=${cookie.id_token}&post_logout_redirect_uri=http://localhost/auth/destroy`
  );

export const getCurrentUser = async (
  openIdConfig: ObjectOf<any>,
  jwt: string
): Promise<Response> =>
  await fetch(`${openIdConfig.userinfo_endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });

export const jwtExpired = (payload: JwtPayload): boolean =>
  dayjs().isAfter(payload.exp * 1000);

export const handleResponse = async (
  data: SessionWrapper
): Promise<TypedResponse<any>> =>
  json(data.callbackResult, {
    headers: {
      'Set-Cookie': data.commitSession,
    },
  });

export const withSession = async (
  request: Request,
  callback: (session: Session) => any
): Promise<SessionWrapper> => {
  const session = await getSession(request.headers.get('Cookie'));
  const c = await callback(session);
  const commitSession = await sessionStorage.commitSession(session);

  return { commitSession, callbackResult: c };
};

export const { getSession, destroySession, commitSession } = sessionStorage;
