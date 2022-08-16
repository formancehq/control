import { get } from 'lodash';

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
    const res = await fetch(this.decorateUrl(uri), {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.status === 204) {
      return {} as any;
    }
    const json = await res.json();

    return path ? get(json, path) : json;
  }

  public async getResource<T>(params: string, path?: string): Promise<T> {
    const res = await fetch(this.decorateUrl(params));
    const json = await res.json();

    return path ? get(json, path) : json;
  }
}
