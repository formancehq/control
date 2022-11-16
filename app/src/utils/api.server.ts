/* eslint-disable @typescript-eslint/ban-ts-comment*/
import * as otlpApi from '@opentelemetry/api';
import { SpanStatusCode } from '@opentelemetry/api';
import { Session } from '@remix-run/node';
import { get, isUndefined } from 'lodash';

import {
  ApiClient,
  Authentication,
  logger,
  Methods,
  toJson,
} from '~/src/utils/api';
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
    path?: string
  ): Promise<T | undefined | void> {
    return this.handleRequest(Methods.PUT, params, undefined, path);
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
    const sessionHolder: Authentication = parseSessionHolder(this.session);
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${sessionHolder.access_token}`,
    };

    const activeOtlpContext = otlpApi.context.active();
    const carrier = {};
    otlpApi.propagation.inject(
      activeOtlpContext,
      carrier,
      otlpApi.defaultTextMapSetter
    );
    const span = otlpApi.trace
      .getTracer('Api Client')
      .startSpan('http.request');

    // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/http.md
    const parsedUrl = new URL(uri);
    span.setAttributes({
      'http.method': method,
      'http.url': uri,
      'net.peer.name': parsedUrl.host,
      'net.peer.port': parsedUrl.port,
    });

    return fetch(uri, {
      method,
      headers: {
        ...this.headers,
        ...carrier,
      },
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    })
      .then(async (response) => {
        span.setAttributes({
          'http.status': response.status,
        });
        if (response.status > 400) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: await response.text(),
          });
        }

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
        span.recordException(e);
        throw new Error('Error');
      }) // allow error to be catch on higher level (root) // TODO improve handler
      .finally(() => span.end());
  }
}
