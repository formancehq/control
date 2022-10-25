import { ApiClient, Methods } from '~/src/utils/api';

export class ReactApiClient implements ApiClient {
  getResource<T>(
    params: string,
    path?: string | undefined
  ): Promise<T | undefined> {
    return fetch('/proxify', {
      method: Methods.POST,
      body: JSON.stringify({
        params,
        path,
      }),
    }).then((response) => response.json());
  }

  postResource<T>(
    params: string,
    body: any,
    path: string | undefined
  ): Promise<T | undefined> {
    return fetch('/proxify', {
      method: Methods.POST,
      body: JSON.stringify({
        params,
        path,
        body,
      }),
    }).then((response) => response.json());
  }

  deleteResource<T>(
    params: string,
    path: string | undefined
  ): Promise<T | undefined> {
    return fetch('/proxify', {
      method: Methods.DELETE,
      body: JSON.stringify({
        params,
        path,
      }),
    }).then((response) => response.json());
  }
}
