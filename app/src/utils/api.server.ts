/* eslint-disable @typescript-eslint/ban-ts-comment*/
import { Session } from '@remix-run/node';
import { get, isUndefined } from 'lodash';

import { ApiClient, Authentication, Methods } from '~/src/utils/api';
import { parseSessionHolder } from '~/src/utils/auth.server';

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
    return this.handleRequest(Methods.POST, params, body, path);
  }

  public async getResource<T>(
    params?: string,
    path?: string
  ): Promise<T | undefined> {
    return this.handleRequest(Methods.GET, params, undefined, path);
  }

  public async deleteResource<T>(
    params: string,
    path?: string
  ): Promise<T | undefined> {
    return this.handleRequest(Methods.DELETE, params, path);
  }

  private async handleRequest<T>(
    method: Methods,
    params?: string,
    body?: any,
    path?: string
  ): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const uri = params ? this.decorateUrl(params) : this.baseUrl!;
    const sessionHolder: Authentication = parseSessionHolder(this.session);

    return fetch(uri, {
      method,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${sessionHolder.access_token}`,
      },
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    })
      .then((response) => {
        if (response?.status === 200) {
          return response.json();
        }
        if (response?.status === 204) {
          return {};
        }
      })
      .catch((e: any) => {
        console.info(e);
      }) // allow error to be catch on higher level (root) // TODO improve handler
      .then((response) => (path ? get(response, path) : response));
  }
}
