/* eslint-disable @typescript-eslint/ban-ts-comment*/
import {Session} from '@remix-run/node';
import {get, isUndefined} from 'lodash';

import {Errors} from '~/src/types/generic';
import {ApiClient} from '~/src/utils/api';
import {parseSessionHolder, SessionHolder,} from '~/src/utils/auth.server';

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
        .then((response) => response.json())
        .then((response) => (path ? get(response, path) : response))
    );
  }
}
