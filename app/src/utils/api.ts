import { get } from 'lodash';
import { Errors } from '~/src/types/generic';

export const API_SEARCH = 'search';
export const API_LEDGER = 'ledger';
export const API_PAYMENT = 'payments';

export interface IApiClient {
  baseUrl: string;
  decorateUrl: (uri: string) => string;
  postResource: <T>(uri: string, body: any, path?: string) => Promise<T>;
  getResource: <T>(params: string, path?: string) => Promise<T>;
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

  public decorateUrl(uri: string): string {
    return `${this.baseUrl}/${uri}`;
  }

  public async postResource<T>(
    uri: string,
    body: any,
    path?: string
  ): Promise<T> {
    let data: T;
    let res: Response;
    try {
      res = await fetch(this.decorateUrl(uri), {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (res && res.status === 204) {
        return {} as any;
      }

      data = path ? get(json, path) : json;
    } catch (e) {
      throw new Error(Errors.MS_DOWN);
    }

    if (!data && res && res.status !== 204) {
      throw new Error(Errors.NOT_FOUND);
    }

    return data;
  }

  public async getResource<T>(params: string, path?: string): Promise<T> {
    let data;
    let res;
    try {
      res = await fetch(this.decorateUrl(params));
      const json = await res.json();

      data = path ? get(json, path) : json;
    } catch (e) {
      throw new Error(Errors.MS_DOWN);
    }

    if (!data && res && res.status !== 204) {
      throw new Error(Errors.NOT_FOUND);
    }

    return data;
  }
}
