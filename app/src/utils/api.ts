import { get } from 'lodash';
import { Errors } from '~/src/types/generic';

export const API_SEARCH = 'search';
export const API_LEDGER = 'ledger';
export const API_PAYMENT = 'payments';

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

export interface IApiClient {
  baseUrl: string;
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

  throwError(stack?: any, from?: string, response?: Response): Error {
    const e = get(errorsMap, response?.status || 422, errorsMap['422']);
    logger(stack, from, response);

    throw new Error(e);
  }

  public decorateUrl(uri: string): string {
    return `${this.baseUrl}/${uri}`;
  }

  public async postResource<T>(
    params: string,
    body: any,
    path?: string
  ): Promise<T | undefined> {
    console.log('boody', body);

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
    const uri = this.decorateUrl(params);
    try {
      if (body) {
        res = await fetch(uri, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(this.decorateUrl(params));
      }
      if (res && res.status === 204) {
        return {} as any;
      }
      const json = await res.json();

      data = path ? get(json, path) : json;
    } catch (e) {
      // TODO backend need to fix the search 503 api error !!!!!!!!
      // remove this mock once backend search is fixed
      if (params === 'search' && res?.status === 503) {
        return {} as any;
      }
      this.throwError(e, undefined, res);
    }

    if (!data && res && res.status !== 204) {
      console.log('WHAT2');

      this.throwError(undefined, undefined, res);
    }

    if (data) {
      return data;
    }
  }
}
