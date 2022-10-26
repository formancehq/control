import { ApiClient, logger, Methods, toJson } from '~/src/utils/api';

export class ReactApiClient implements ApiClient {
  getResource<T>(
    params: string,
    path?: string | undefined
  ): Promise<T | undefined | void> {
    return fetch('/proxify', {
      method: Methods.POST,
      body: JSON.stringify({
        params,
        path,
      }),
    })
      .then(async (response) => await toJson<T>(response))
      .catch((e: any) => logger(e, 'api.client', { params, path }));
  }

  postResource<T>(
    params: string,
    body: any,
    path: string | undefined
  ): Promise<T | undefined | void> {
    return fetch('/proxify', {
      method: Methods.POST,
      body: JSON.stringify({
        params,
        path,
        body,
      }),
    })
      .then(async (response) => await toJson<T>(response))
      .catch((e: any) => logger(e, 'api.client', { params, body }));
  }

  deleteResource<T>(
    params: string,
    path: string | undefined
  ): Promise<T | undefined | void> {
    return fetch('/proxify', {
      method: Methods.DELETE,
      body: JSON.stringify({
        params,
        path,
      }),
    })
      .then(async (response) => await toJson<T>(response))
      .catch((e: any) => logger(e, 'api.client', { params }));
  }
}
