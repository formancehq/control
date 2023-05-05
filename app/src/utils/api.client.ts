import { get } from 'lodash';

import { ApiClient, logger, Methods, toJson } from '~/src/utils/api';

export class ReactApiClient implements ApiClient {
  private baseUrl: string | undefined;
  private masterToken = false;

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }
  setMasterToken(masterToken: boolean) {
    this.masterToken = masterToken;
  }

  getResource<T>(
    params: string,
    path?: string | undefined
  ): Promise<T | undefined | void> {
    return this.handleRequest<T>(Methods.GET, params, undefined, path);
  }

  putResource<T>(
    params: string,
    path?: string | undefined
  ): Promise<T | undefined | void> {
    return this.handleRequest<T>(Methods.PUT, params, undefined, path);
  }

  postResource<T>(
    params: string,
    body: any,
    path: string | undefined
  ): Promise<T | undefined | void> {
    return this.handleRequest<T>(Methods.POST, params, body, path);
  }

  deleteResource<T>(
    params: string,
    path: string | undefined
  ): Promise<T | undefined | void> {
    return this.handleRequest<T>(Methods.DELETE, params, undefined, path);
  }

  handleRequest<T>(
    method: Methods,
    params?: string,
    body?: any,
    path?: string
  ): Promise<T | undefined | void> {
    return fetch('/proxify', {
      method: Methods.POST,
      body: JSON.stringify({
        params,
        path,
        method,
        body,
        masterToken: this.masterToken,
        baseUrl: this.baseUrl,
      }),
    })
      .then(async (response) => {
        const json = await toJson<T>(response);

        return path ? get(json, path, json) : json;
      })
      .catch((e: any) => {
        logger(e, 'api.client', { params, path, body, method });
        throw new Error('Error');
      });
  }
}
