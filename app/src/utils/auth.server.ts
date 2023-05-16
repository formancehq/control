import crypto from 'crypto';

import {
  createCookie,
  createCookieSessionStorage,
  json,
  Session,
} from '@remix-run/node';
import { TypedResponse } from '@remix-run/server-runtime';
import { get } from 'lodash';

import { ObjectOf } from '~/src/types/generic';
import {
  API_AUTH,
  AuthCookie,
  Authentication,
  CurrentUser,
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

export const createAuthCookie = (
  currentUser: CurrentUser,
  refreshToken: string,
  expiresIn: number,
  masterToken: string,
  accessToken?: string | undefined
): AuthCookie => ({
  access_token: accessToken,
  refresh_token: refreshToken,
  expires_in: expiresIn,
  master_access_token: masterToken,
  currentUser,
});

export const parseSessionHolder = (session: Session): AuthCookie =>
  decrypt<AuthCookie>(session.get(COOKIE_NAME));

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

export const encrypt = (payload: AuthCookie): string => {
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

export const getAuthStackOpenIdConfig = async (
  url: string
): Promise<OpenIdConfiguration> => {
  const uri = `${url}${API_AUTH}/.well-known/openid-configuration`;

  return fetch(uri)
    .then(async (response) => response.json())
    .catch((e) => {
      throw new Error('Error while fetching openid config from auth stack');
    });
};
export const getMembershipOpenIdConfig =
  async (): Promise<OpenIdConfiguration> => {
    const uri = `${process.env.MEMBERSHIP_URL_API}/.well-known/openid-configuration`;

    return fetch(uri)
      .then(async (response) => response.json())
      .catch(() => {
        throw new Error('Error while fetching openid config from membership');
      });
  };

export const getCurrentUser = async (
  openIdConfig: OpenIdConfiguration,
  token: string
): Promise<CurrentUser> =>
  fetch(`${process.env.MEMBERSHIP_URL_API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (response) => {
      const data = await response.json();

      return get(data, 'data');
    })
    .catch(() => {
      throw new Error('Error while fetching current user');
    });

export const getJwtPayload = (
  decryptedCookie: AuthCookie
): JwtPayload | undefined =>
  JSON.parse(
    Buffer.from(
      decryptedCookie.master_access_token.split('.')[1],
      'base64'
    ).toString()
  );

export const getAccessTokenFromCode = async (
  openIdConfig: ObjectOf<any>,
  code: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=authorization_code&client_id=${process.env.MEMBERSHIP_CLIENT_ID}&client_secret=${process.env.MEMBERSHIP_CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}${AUTH_CALLBACK_ROUTE}`;

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
  const uri = `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${process.env.MEMBERSHIP_CLIENT_ID}&client_secret=${process.env.MEMBERSHIP_CLIENT_SECRET}&refresh_token=${refreshToken}`;

  return fetch(uri, {
    method: 'POST',
  }).then(async (response) => {
    if (response.status != 200) {
      throw new Error('Error while refreshing access token');
    }

    return await response.json();
  });
};

export const getSecurityToken = async (
  openIdConfig: OpenIdConfiguration,
  audience: string,
  subjectToken: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=urn:ietf:params:oauth:grant-type:token-exchange&audience=${audience}&subject_token_type=urn:ietf:params:oauth:token-type:access_token&subject_token=${subjectToken}`;

  return fetch(uri, {
    method: 'POST',
    headers: {
      Authorization: getBasicAuth(
        process.env.MEMBERSHIP_CLIENT_ID!,
        process.env.MEMBERSHIP_CLIENT_SECRET
      ),
    },
  }).then(async (response) => {
    if (response.status != 200) {
      const data = await response.json();
      throw new Error(
        `Error while getting security token: ${response.status} / ${response.statusText} : ${data.error} - ${data.error_description}`
      );
    }

    return await response.json();
  });
};

export const getBasicAuth = (id: string, secret = '') => {
  const auth = `${id}:${secret}`;
  const buff = new Buffer(auth);
  const basic = buff.toString('base64');

  return `Basic ${basic}`;
};

export const exchangeToken = async (
  openIdConfig: OpenIdConfiguration,
  assertion: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}&scope=openid email`;

  return fetch(uri, {
    headers: { Authorization: getBasicAuth('fctl') }, // todo change once backend is ready
    method: 'POST',
  }).then(async (response) => {
    if (response.status != 200) {
      throw new Error(
        `Error while exchanging token: ${response.status} / ${response.statusText}`
      );
    }

    return await response.json();
  });
};

export const introspect = async (
  openIdConfig: OpenIdConfiguration,
  accessToken: string,
  clientId: string,
  clientSecret?: string
): Promise<{ active: boolean }> => {
  const data = new FormData();
  data.append('token', accessToken || '');

  return fetch(openIdConfig.introspection_endpoint, {
    headers: { Authorization: getBasicAuth(clientId, clientSecret) },
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
