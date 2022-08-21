import { get } from 'lodash';
import { Errors } from '~/src/types/generic';

export const API_SEARCH = 'search';
export const API_LEDGER = 'ledger';
export const API_PAYMENT = 'payments';

export const errorsMap = {
  404: Errors.NOT_FOUND,
  401: Errors.UNAUTHORIZED,
  403: Errors.FORBIDDEN,
  422: Errors.ERROR,
  500: Errors.SERVICE_DOWN,
  502: Errors.SERVICE_DOWN,
  503: Errors.SERVICE_DOWN,
};

export interface IApiClient {
  baseUrl: string;
  decorateUrl: (uri: string) => string;
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined>;
  getResource: <T>(params: string, path?: string) => Promise<T | undefined>;
}

export class ApiClient implements IApiClient {
  public baseUrl: string;

  constructor(url?: string) {
    this.baseUrl = url || 'http://localhost';

    if (typeof process !== 'undefined') {
      if (!url) {
        if (process.env.API_URL_BACK) {
          this.baseUrl = process.env.API_URL_BACK;
        } else throw new Error('API_URL_BACK is not defined');
      }
    }
  }

  private static throwError(code = 422): Error {
    const error = get(errorsMap, code, errorsMap['422']);
    console.error('api -', error);

    throw new Error(error);
  }

  public decorateUrl(uri: string): string {
    return `${this.baseUrl}/${uri}`;
  }

  public async postResource<T>(
    params: string,
    body: any,
    path?: string
  ): Promise<T | undefined> {
    return this.handleRequest(params, body, path);
  }

  public async getResource<T>(
    params: string,
    path?: string
  ): Promise<T | undefined> {
    return this.handleRequest(params, undefined, path);
  }

  private async handleRequest<T>(
    params: string,
    body?: any,
    path?: string
  ): Promise<T | undefined> {
    let data: T | undefined = undefined;
    let res: Response | undefined = undefined;
    try {
      if (body) {
        res = await fetch(this.decorateUrl(params), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(this.decorateUrl(params));
      }
      const json = await res.json();
      if (res && res.status === 204) {
        return {} as any;
      }

      data = path ? get(json, path) : json;
    } catch (e) {
      ApiClient.throwError(res?.status);
    }

    if (!data && res && res.status !== 204) {
      ApiClient.throwError(res.status);
    }

    if (data) {
      return data;
    }
  }
}
