import { ApiClient } from '~/src/utils/api';

export class ReactApiClient implements ApiClient {
  getResource<T>(
    params: string,
    path: string | undefined
  ): Promise<T | undefined> {
    return fetch('/proxify', {
      method: 'POST',
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
      method: 'POST',
      body: JSON.stringify({
        params,
        path,
        body,
      }),
    }).then((response) => response.json());
  }
}
