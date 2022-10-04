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

export class ApiClient implements IApiClient {
  public baseUrl: string;
  public request: Request;
  protected headers: Headers;

  constructor(url: string, request: Request) {
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
    this.request = request;
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
    const uri = params ? this.decorateUrl(params) : this.baseUrl;
    const session = await getSession(this.request.headers.get('Cookie'));
    let auth = decrypt(session.get(COOKIE_NAME)) as Authentication;

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
      const json = await httpResponse.json();

      data = path ? get(json, path) : json;
    } catch (e: any) {
      if (
        httpResponse!.status === 401 ||
        httpResponse!.status === 400 ||
        httpResponse!.status === 403
      ) {
        const url = new URL(this.request.url);
        const openIdConfig = await getOpenIdConfig();
        auth = (await (
          await refreshToken(openIdConfig, url, auth)
        ).json()) as Authentication;
        session.set(COOKIE_NAME, encrypt(auth));
      }
      httpResponse = await tryRequest();
      const json = await httpResponse.json();
      data = path ? get(json, path) : json;
    }

    return data;
  }
}

export class ReactApiClient implements IApiClient {
  decorateUrl(uri: string): string {
    return '';
  }

  getResource<T>(
    params: string,
    path: string | undefined
  ): Promise<T | undefined> {
    return fetch('/proxify', {
      method: 'GET',
      body: JSON.stringify({
        params,
        path,
      }),
    }).then((response) => response.json());
  }

  postResource<T>(
    params: string,
    body: any,
    path: string | undefined
  ): Promise<T | undefined> {
    return fetch('/proxify', {
      method: 'POST',
      body: JSON.stringify({
        params,
        path,
        body,
      }),
    }).then((response) => response.json());
  }

  throwError(
    stack: any,
    from: string | undefined,
    response: Response | undefined
  ): Error {
    throw new Error('not implemented');
  }
}
