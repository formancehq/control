/* eslint-disable @typescript-eslint/ban-ts-comment*/
import { Session } from '@remix-run/node';
import { get, isUndefined } from 'lodash';

import {
  ApiClient,
  AuthCookie,
  logger,
  Methods,
  toJson,
} from '~/src/utils/api';
import { parseSessionHolder } from '~/src/utils/auth.server';
import { getFavorites, getStackApiUrl } from '~/src/utils/membership';

export type Headers = { Authorization?: string; 'Content-Type': string };

export const createApiClient = async (
  session: Session,
  url?: string,
  masterToken = false
): Promise<ApiClient> => {
  const sessionHolder = parseSessionHolder(session);
  const baseUrl = url
    ? url
    : `${get(getFavorites(sessionHolder.currentUser), 'stackUrl')}/api`;

  return new DefaultApiClient(session, masterToken, baseUrl);
};

export class DefaultApiClient implements ApiClient {
  public baseUrl: string | undefined;
  public session: Session;
  private readonly masterToken: boolean;
  protected headers: Headers;

  constructor(session: Session, masterToken: boolean, url?: string) {
    this.baseUrl = url;
    this.headers = {
      'Content-Type': 'application/json',
    };
    if (typeof process !== 'undefined') {
      if (isUndefined(url)) {
        const sessionHolder = parseSessionHolder(session);
        if (sessionHolder) {
          this.baseUrl = getStackApiUrl(sessionHolder.currentUser);
        } else throw new Error('Api Url is not defined');
      }
    }
    this.masterToken = masterToken;
    this.session = session;
  }

  public decorateUrl(uri: string): string {
    return `${this.baseUrl}${uri}`;
  }

  public async postResource<T>(
    params?: string,
    body?: any,
    path?: string
  ): Promise<T | undefined | void> {
    return this.handleRequest(Methods.POST, params, body, path);
  }

  public async getResource<T>(
    params?: string,
    path?: string
  ): Promise<T | undefined | void> {
    return this.handleRequest(Methods.GET, params, undefined, path);
  }

  public async putResource<T>(
    params?: string,
    path?: string,
    body?: any
  ): Promise<T | undefined | void> {
    return this.handleRequest(Methods.PUT, params, body, path);
  }

  public async deleteResource<T>(
    params: string,
    path?: string
  ): Promise<T | undefined | void> {
    return this.handleRequest(Methods.DELETE, params, path);
  }

  private async handleRequest<T>(
    method: Methods,
    params?: string,
    body?: any,
    path?: string
  ): Promise<T | undefined | void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const uri = params ? this.decorateUrl(params) : this.baseUrl!;
    const sessionHolder: AuthCookie = parseSessionHolder(this.session);
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${
        this.masterToken
          ? sessionHolder.master_access_token
          : sessionHolder.access_token
      }`,
    };

    return fetch(uri, {
      method,
      headers: this.headers,
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    })
      .then(async (response) => {
        const json = await toJson<T>(response);

        return path ? get(json, path) : json;
      })
      .catch((e: any) => {
        logger(e, 'api.server', {
          params,
          body,
          url: uri,
          method,
          headers: this.headers,
        });
        throw new Error('Error');
      }); // allow error to be catch on higher level (root) // TODO improve handler
  }
}
