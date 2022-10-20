import { Errors } from '~/src/types/generic';

export const API_SEARCH = '/search';
export const API_LEDGER = '/ledger';
export const API_PAYMENT = '/payments';
export const API_AUTH = '/auth';

export const errorsMap = {
  404: Errors.NOT_FOUND,
  401: Errors.UNAUTHORIZED,
  403: Errors.FORBIDDEN,
  422: Errors.ERROR,
  500: Errors.SERVICE_DOWN,
  502: Errors.SERVICE_DOWN,
  503: Errors.SERVICE_DOWN,
};

export interface ApiClient {
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined>;
  getResource: <T>(params: string, path?: string) => Promise<T | undefined>;
}

export type SessionWrapper = {
  cookieValue?: string;
  callbackResult: any;
};
export type CurrentUser = {
  sub: string;
  scp: string[];
  email: string;
  email_verified: boolean;
  avatarLetter: string | undefined;
  pseudo: string | undefined;
  jwt: string;
};
export type Authentication = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id_token: string;
  error?: string;
  error_description?: string;
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

export const logger = (
  stack?: any,
  from?: string,
  response?: any,
  request?: any
) => {
  // eslint-disable-next-line no-console
  console.error({
    from: from || 'utils/api',
    request,
    response,
    stack,
    page: typeof window !== 'undefined' ? window.location : '',
  });
};
