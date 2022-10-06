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
  getSession, parseSessionHolder,
  RefreshingTokenError,
  refreshToken, SessionHolder,
  sessionStorage,
  UnauthenticatedError,
} from '~/src/utils/auth.server';

export interface PendingRefresh {
  date: Date;
  promise: Promise<Authentication>;
}

// @ts-ignore
if (!global.pendingRefresh) {
  console.info('Init pending refresh map')
  // @ts-ignore
  global.pendingRefresh = new Map<string, PendingRefresh>();
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
  session: Session,
  url?: string
): Promise<ApiClient> => {
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
  ): Promise<T> {
    const uri = params ? this.decorateUrl(params) : this.baseUrl!;
    let sessionHolder: SessionHolder = parseSessionHolder(this.session);
    // @ts-ignore
    const allPendingRefresh: Map<string, PendingRefresh> = global.pendingRefresh;

    // TODO: Override expiration to 10 seconds
    if(sessionHolder.date.getTime()/1000 + /*sessionHolder.authentication.expires_in*/ 20 - 10 < new Date().getTime()/1000) {
      const oldRefreshToken = sessionHolder.authentication.refresh_token;
      let pendingRefresh = allPendingRefresh.get(sessionHolder.authentication.refresh_token);

      let pendingPromise: Promise<Authentication>
      if (!pendingRefresh) {
        allPendingRefresh.set(sessionHolder.authentication.refresh_token, {
          date: new Date(),
          promise: new Promise<Authentication>(async (resolve, reject) => {
            refreshToken(await getOpenIdConfig(), sessionHolder.authentication.refresh_token)
                .then(resolve)
                .catch(reject)
                .finally(() => {
                  console.info('Delete entry for token ' + oldRefreshToken)
                  allPendingRefresh.delete(oldRefreshToken);
                })
          }),
        });
        pendingPromise = allPendingRefresh.get(sessionHolder.authentication.refresh_token)!.promise;
      } else {
        // In case of parallel requests
        pendingPromise = pendingRefresh.promise
      }
      this.session.set(COOKIE_NAME, encrypt({
        date: new Date(),
        authentication: await pendingPromise
      } as SessionHolder))
    }

    return fetch(uri, {
      method: body ? 'POST' : 'GET',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${sessionHolder.authentication.access_token}`,
      },
      body: body
          ? body instanceof FormData
              ? body
              : JSON.stringify(body)
          : undefined,
    })
        .then(response => response.json())
        .then(response => path ? get(response, path) : response);
  }
}
