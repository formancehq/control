import { Session } from '@remix-run/node';
import { get } from 'lodash';

import { Errors } from '~/src/types/generic';
import {
  Authentication,
  COOKIE_NAME,
  decrypt,
  encrypt,
  getOpenIdConfig,
  getSession,
  refreshToken,
} from '~/src/utils/auth.server';

export const API_SEARCH = '/search';
export const API_LEDGER = '/ledger';
export const API_PAYMENT = '/payments';
export const API_AUTH = '/auth';

console.log('je passe plein de fois');
declare global {
  let __api: IApiClient | undefined;
}
let apiServer: IApiClient;

export const logger = (stack?: any, from?: string, response?: Response) => {
  // eslint-disable-next-line no-console
  console.error({
    from: from || 'utils/api',
    response: {
      status: response?.status,
      message: response?.statusText,
      url: response?.url,
    },
    stack,
    page: typeof window !== 'undefined' ? window.location : '',
  });
};

export const errorsMap = {
  404: Errors.NOT_FOUND,
  401: Errors.UNAUTHORIZED,
  403: Errors.FORBIDDEN,
  422: Errors.ERROR,
  500: Errors.SERVICE_DOWN,
  502: Errors.SERVICE_DOWN,
  503: Errors.SERVICE_DOWN,
};

export type Headers = { Authorization?: string; 'Content-Type': string };

export interface IApiClient {
  decorateUrl: (uri: string) => string;
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined>;
  getResource: <T>(params: string, path?: string) => Promise<T | undefined>;
  throwError: (stack?: any, from?: string, response?: Response) => Error;
}

export const createApiClient = async (
  request: Request,
  url?: string
): Promise<IApiClient> => {
  const session = await getSession(request.headers.get('Cookie'));
  if (process.env.NODE_ENV === 'production') {
    apiServer = new ApiClient(session, url);
  } else {
    if (!global.__api) {
      global.__api = new ApiClient(session, url);
    }
    apiServer = global.__api;
  }

  return apiServer;
};

export class ApiClient implements IApiClient {
  public baseUrl: string | undefined;
  public session: Session;
  protected headers: Headers;

  constructor(session: Session, url?: string) {
    this.baseUrl = url;
    this.headers = {
      'Content-Type': 'application/json',
    };

    if (typeof process !== 'undefined') {
      if (!url) {
        if (process.env.API_URL_BACK) {
          this.baseUrl = process.env.API_URL_BACK;
        } else throw new Error('API_URL_BACK is not defined');
      }
    }
    this.session = session;
  }

  throwError(stack?: any, from?: string, response?: Response): Error {
    const e = get(errorsMap, response?.status || 422, errorsMap['422']);
    logger(stack, from, response);
    throw new Error(e);
  }

  public decorateUrl(uri: string): string {
    return `${this.baseUrl}${uri}`;
  }

  public async postResource<T>(
    params?: string,
    body?: any,
    path?: string
  ): Promise<T | undefined> {
    return this.handleRequest(params, body, path);
  }

  public async getResource<T>(
    params?: string,
    path?: string
  ): Promise<T | undefined> {
    return this.handleRequest(params, undefined, path);
  }

  private async handleRequest<T>(
    params?: string,
    body?: any,
    path?: string
  ): Promise<T | undefined> {
    let data: T | undefined = undefined;
    const uri = params ? this.decorateUrl(params) : this.baseUrl!;
    let auth = decrypt(this.session.get(COOKIE_NAME)) as Authentication;

    const tryRequest = async () =>
      await fetch(uri, {
        method: body ? 'POST' : 'GET',
        headers: this.headers,
        body: body
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
      });

    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${auth.access_token}`,
    };
    let httpResponse: Response;
    try {
      httpResponse = await tryRequest();
      if (httpResponse && httpResponse.status === 204) {
        return {} as any;
      }
      console.log('httpResponse', httpResponse);
      const jsonResult = await httpResponse.json();
      data = path ? get(jsonResult, path) : jsonResult;
    } catch (e: any) {
      // logger(e);
      const openIdConfig = await getOpenIdConfig();
      if (
        httpResponse!.status === 401 ||
        httpResponse!.status === 403 ||
        httpResponse!.status === 400
      ) {
        console.log('before refresh', auth);
        const refreshResponse = await refreshToken(openIdConfig, auth);
        console.log('refreshResponse', refreshResponse);
        if (
          refreshResponse!.status === 401 ||
          refreshResponse!.status === 403 ||
          refreshResponse!.status === 400
        ) {
          console.log("can't refresh !");

          return undefined;
        } else {
          auth = await refreshResponse.json();
          this.session.set(COOKIE_NAME, encrypt(auth));
          console.log('REFRESH success', auth.refresh_token);
        }
      }

      httpResponse = await tryRequest();
      console.log('retry after refresh succeed', httpResponse);
      const jsonResult = await httpResponse.json();
      data = path ? get(jsonResult, path) : jsonResult;
    }

    return data;
  }
}
