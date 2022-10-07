/* eslint-disable @typescript-eslint/ban-ts-comment*/
import { Session } from '@remix-run/node';
import { Mutex } from 'async-mutex';
import { get, isUndefined } from 'lodash';

import { Errors } from '~/src/types/generic';
import { ApiClient, Authentication } from '~/src/utils/api';
import {
  COOKIE_NAME,
  encrypt,
  getOpenIdConfig,
  parseSessionHolder,
  refreshToken,
  SessionHolder,
} from '~/src/utils/auth.server';

export interface PendingRefresh {
  date: Date;
  promise: Promise<Authentication>;
}

// @ts-ignore
if (!global.pendingRefresh) {
  console.info('Init pending refresh map');
  // @ts-ignore
  global.pendingRefresh = new Map<string, PendingRefresh>();
  // @ts-ignore
  global.mutex = new Mutex();
}

export const getMutex = (): Mutex =>
  // @ts-ignore
  global.mutex;

export const runWithMutex = (callback: () => void) =>
  getMutex().runExclusive(() => {
    callback();
  });

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
): Promise<ApiClient> => new DefaultApiClient(session, url);

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
    const sessionHolder: SessionHolder = parseSessionHolder(this.session);
    // @ts-ignore
    const allPendingRefresh: Map<string, PendingRefresh> =
      global.pendingRefresh;

    let pendingPromise: Promise<Authentication> | undefined;
    await runWithMutex(() => {
      // TODO: Override expiration to 10 seconds
      if (
        sessionHolder.date.getTime() / 1000 +
          /*sessionHolder.authentication.expires_in*/ 15 -
          10 <
        new Date().getTime() / 1000
      ) {
        console.info('Detect expired token');
        const oldRefreshToken = sessionHolder.authentication.refresh_token;
        const pendingRefresh = allPendingRefresh.get(
          sessionHolder.authentication.refresh_token
        );

        if (!pendingRefresh) {
          allPendingRefresh.set(sessionHolder.authentication.refresh_token, {
            date: new Date(),
            promise: new Promise<Authentication>(async (resolve, reject) => {
              console.info(
                'Refresh token',
                sessionHolder.authentication.refresh_token
              );
              refreshToken(
                await getOpenIdConfig(),
                sessionHolder.authentication.refresh_token
              )
                .then((authentication) => {
                  this.session.set(
                    COOKIE_NAME,
                    encrypt({
                      date: new Date(),
                      authentication,
                    } as SessionHolder)
                  );
                  console.info(
                    'Update session with new refresh',
                    authentication.refresh_token
                  );
                  resolve(authentication);
                })
                .catch(reject)
                .finally(() => {
                  setTimeout(() => {
                    runWithMutex(() => {
                      allPendingRefresh.delete(oldRefreshToken);
                    });
                  }, 60000); // Parallel requests
                });
            }),
          });
          pendingPromise = allPendingRefresh.get(
            sessionHolder.authentication.refresh_token
          )!.promise;
        } else {
          console.info('Reuse pending refresh token');
          // In case of parallel requests
          pendingPromise = pendingRefresh.promise;
        }
      }
    });

    if (pendingPromise) {
      // If undefined, then no refresh has occured
      await pendingPromise;
    }

    console.info('fetch ' + uri);

    return (
      fetch(uri, {
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
        .then(async (response) => {
          const textualResponse = await response.text();
          console.info(textualResponse);

          return JSON.parse(textualResponse);
        })
        // .then((response) => response.json())
        .then((response) => (path ? get(response, path) : response))
    );
  }
}
