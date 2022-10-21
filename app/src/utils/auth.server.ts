import crypto from 'crypto';

import { createCookieSessionStorage, json, Session } from '@remix-run/node';
import { TypedResponse } from '@remix-run/server-runtime';

import { ObjectOf } from '~/src/types/generic';
import {
  API_AUTH,
  Authentication,
  JwtPayload,
  SessionWrapper,
} from '~/src/utils/api';

export const COOKIE_NAME = 'auth_session';
export const AUTH_CALLBACK_ROUTE = '/auth/login';
export const REDIRECT_URI = process.env.REDIRECT_URI;

export interface State {
  redirectTo: string;
}

export const parseSessionHolder = (session: Session): Authentication =>
  decrypt<Authentication>(session.get(COOKIE_NAME));

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
}

export const getOpenIdConfig = async (): Promise<OpenIdConfiguration> => {
  const uri = `${process.env.API_URL}${API_AUTH}/.well-known/openid-configuration`;

  return fetch(uri)
    .catch((e) => {
      throw new Error(
        `Unable to fetch OIDC discovery on ${uri}: ${e.toString()}`
      );
    })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          `Unexpected status code ${response.status} when fetching openid config`
        );
      }

      return response.json();
    });
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

  return await fetch(uri).then((response) => {
    if (response.status != 200) {
      throw new Error(
        `Unexpected status code ${
          response.status
        } when refreshing token, body ${response.text()}`
      );
    }

    return response.json();
  });
};

export const refreshToken = async (
  openIdConfig: OpenIdConfiguration,
  refreshToken: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${refreshToken}`;

  return fetch(uri).then(async (response) => {
    if (response.status != 200) {
      throw new Error(
        `Unexpected status code ${
          response.status
        } when refreshing token, body ${await response.text()}`
      );
    }

    return await response.json();
  });
};

export const handleResponse = async (
  data: SessionWrapper
): Promise<TypedResponse<any>> => {
  if (data.cookieValue) {
    console.info('New cookie value received, write it');
  }

  return json(data.callbackResult, {
    headers: data.cookieValue
      ? {
          'Set-Cookie': data.cookieValue,
        }
      : {},
  });
};

export const withSession = async (
  request: Request,
  callback: (session: Session) => any
): Promise<SessionWrapper> => {
  const session = await getSession(request.headers.get('Cookie'));
  const c = await callback(session);
  const commitSession = await sessionStorage.commitSession(session);
  const commitSessionCookieValue = commitSession.split(';')[0];

  if (request.headers.get('Cookie') != commitSessionCookieValue) {
    console.info('Original cookie: ', request.headers.get('Cookie'));
    console.info('Committed session: ', commitSessionCookieValue);
  }

  return {
    cookieValue:
      request.headers.get('Cookie') != commitSessionCookieValue
        ? commitSession
        : undefined,
    callbackResult: c,
  };
};

export const { getSession, destroySession, commitSession } = sessionStorage;
