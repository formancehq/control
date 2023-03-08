import { Errors } from '~/src/types/generic';

export const API_SEARCH = '/search';
export const API_LEDGER = '/ledger';
export const API_PAYMENT = '/payments';
export const API_WALLET = '/wallets';
export const API_AUTH = '/auth';
export const API_WEBHOOK = '/webhooks';
export const API_ORCHESTRATION = '/orchestration';

export const errorsMap = {
  404: Errors.NOT_FOUND,
  401: Errors.UNAUTHORIZED,
  403: Errors.FORBIDDEN,
  422: Errors.ERROR,
  500: Errors.SERVICE_DOWN,
  502: Errors.SERVICE_DOWN,
  503: Errors.SERVICE_DOWN,
};

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface ApiClient {
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined | void>;
  getResource: <T>(
    params: string,
    path?: string
  ) => Promise<T | undefined | void>;
  putResource: <T>(
    params: string,
    path?: string
  ) => Promise<T | undefined | void>;
  deleteResource: <T>(
    params: string,
    path?: string
  ) => Promise<T | undefined | void>;
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
  zone: string;
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

export const logger = (stack?: any, from?: string, more?: any) => {
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development'
  ) {
    const error = {
      from: from || 'utils/api',
      stack,
      more,
    };
    // eslint-disable-next-line no-console
    console.info(error);
  }
};

export const toJson = async <T>(response: Response): Promise<undefined | T> => {
  if (response?.status === 200 || response?.status === 201) {
    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  }

  if (response?.status === 204) {
    return {} as T;
  }

  throw new Error(
    `Responded [${response?.status}] with text [${response?.statusText}] for [${response.url}]`
  );
};
