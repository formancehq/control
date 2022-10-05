import { IApiClient } from "~/src/utils/api.server";

export class ReactApiClient implements IApiClient {
  decorateUrl(uri: string): string {
    return "";
  }

  getResource<T>(
    params: string,
    path: string | undefined
  ): Promise<T | undefined> {
    return fetch("/proxify", {
      method: "POST",
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
    return fetch("/proxify", {
      method: "POST",
      body: JSON.stringify({
        params,
        path,
        body,
      }),
    }).then((response) => response.json());
  }

  throwError(
    stack: any,
    from: string | undefined,
    response: Response | undefined
  ): Error {
    throw new Error("not implemented");
  }
}
