/* eslint-disable @typescript-eslint/ban-ts-comment*/
import { Session } from '@remix-run/node';
import { get, isUndefined } from 'lodash';

import { Errors } from '~/src/types/generic';
import { ApiClient, Authentication, logger } from '~/src/utils/api';
import {
  COOKIE_NAME,
  decrypt,
  encrypt,
  getOpenIdConfig,
  getSession,
  RefreshingTokenError,
  refreshToken,
  sessionStorage,
  UnauthenticatedError,
} from '~/src/utils/auth.server';

// @ts-ignore
if (!global.callCount) {
  // @ts-ignore
  global.pendingRefresh = new Map();
  // @ts-ignore
  global.callCount = 0;
}

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

export const createApiClient = async (
  request: Request,
  url?: string
): Promise<ApiClient> => {
  const session = await getSession(request.headers.get('Cookie'));

  return new DefaultApiClient(session, url);
};

export class DefaultApiClient implements ApiClient {
  public baseUrl: string | undefined;
  public session: Session;
  protected headers: Headers;

  constructor(session: Session, url?: string) {
    this.baseUrl = url;
    this.headers = {
      'Content-Type': 'application/json',
    };
    if (typeof process !== 'undefined') {
      if (isUndefined(url)) {
        if (process.env.API_URL) {
          this.baseUrl = process.env.API_URL;
        } else throw new Error('API_URL is not defined');
      }
    }
    this.session = session;
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

    const tryRequest = async (): Promise<Response> => {
      // @ts-ignore
      global.callCount++;
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${auth.access_token}`,
      };

      return await fetch(uri, {
        method: body ? 'POST' : 'GET',
        headers: this.headers,
        body: body
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
      });
    };

    let httpResponse: Response;
    httpResponse = await tryRequest();
    switch (httpResponse.status) {
      case 200: {
        const jsonResult = await httpResponse.json();
        data = path ? get(jsonResult, path) : jsonResult;
        break;
      }
      case 204:
        return {} as any;
      case 401: {
        const oldRefreshToken = auth.refresh_token;
        // @ts-ignore
        let pendingPromise = global.pendingRefresh.get(auth.refresh_token);
        if (!pendingPromise) {
          const openIdConfig = await getOpenIdConfig();
          if (openIdConfig) {
            pendingPromise = refreshToken(openIdConfig, auth);
            // @ts-ignore
            global.pendingRefresh.set(auth.refresh_token, pendingPromise);
          }
        } else {
          // Do not remove console.info - debug purpose
          // @ts-ignore
          console.info('Pending promise retrieved', global.pendingRefresh);
        }
        const refreshResponse = await pendingPromise;
        // @ts-ignore
        global.pendingRefresh.delete(oldRefreshToken);
        if (!refreshResponse) {
          throw new RefreshingTokenError();
        } else {
          auth = refreshResponse;
          console.info('Refresh', {
            success: true,
            new: auth.refresh_token,
            old: oldRefreshToken,
            jwt: auth.access_token,
          });
          this.session.set(COOKIE_NAME, encrypt(auth));
        }

        httpResponse = await tryRequest();
        switch (httpResponse.status) {
          case 204:
            return {} as any;
          case 401:
            logger(httpResponse);
            throw new UnauthenticatedError();
          case 400:
            logger(httpResponse);
            throw new UnauthenticatedError();
          default: {
            const jsonResult = await httpResponse.json();
            data = path ? get(jsonResult, path) : jsonResult;
            break;
          }
        }
        break;
      }
      default:
        data = {} as any;
        break;
    }

    await sessionStorage.commitSession(this.session);

    return data;
  }
}
