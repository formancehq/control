import { Session } from "@remix-run/node";
import { get } from "lodash";

import { Errors } from "~/src/types/generic";
import {
  Authentication,
  COOKIE_NAME,
  decrypt,
  encrypt,
  getOpenIdConfig,
  getSession,
  refreshToken,
} from "~/src/utils/auth.server";

export const API_SEARCH = "/search";
export const API_LEDGER = "/ledger";
export const API_PAYMENT = "/payments";
export const API_AUTH = "/auth";

declare global {
  let __api: IApiClient | undefined;
}
let apiServer: IApiClient;

export const logger = (stack?: any, from?: string, response?: Response) => {
  // eslint-disable-next-line no-console
  console.error({
    from: from || "utils/api",
    response: {
      status: response?.status,
      message: response?.statusText,
      url: response?.url,
    },
    stack,
    page: typeof window !== "undefined" ? window.location : "",
  });
};

export const errorsMap = {
  404: Errors.NOT_FOUND,
  401: Errors.UNAUTHORIZED,
  403: Errors.FORBIDDEN,
  422: Errors.ERROR,
  500: Errors.SERVICE_DOWN,
  502: Errors.SERVICE_DOWN,
  503: Errors.SERVICE_DOWN,
};

export type Headers = { Authorization?: string; "Content-Type": string };

export interface IApiClient {
  decorateUrl: (uri: string) => string;
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined>;
  getResource: <T>(params: string, path?: string) => Promise<T | undefined>;
  throwError: (stack?: any, from?: string, response?: Response) => Error;
}

export const createApiClient = async (
  request: Request,
  url?: string
): Promise<IApiClient> => {
  const session = await getSession(request.headers.get("Cookie"));
  return new ApiClient(session, url);
};

// @ts-ignore
if (!global.callCount) {
  // @ts-ignore
  global.pendingRefresh = new Map();
  // @ts-ignore
  global.callCount = 0;
}

export class ApiClient implements IApiClient {
  public baseUrl: string | undefined;
  public session: Session;
  protected headers: Headers;

  constructor(session: Session, url?: string) {
    this.baseUrl = url;
    this.headers = {
      "Content-Type": "application/json",
    };

    if (typeof process !== "undefined") {
      if (!url) {
        if (process.env.API_URL_BACK) {
          this.baseUrl = process.env.API_URL_BACK;
        } else throw new Error("API_URL_BACK is not defined");
      }
    }
    this.session = session;
  }

  throwError(stack?: any, from?: string, response?: Response): Error {
    const e = get(errorsMap, response?.status || 422, errorsMap["422"]);
    logger(stack, from, response);
    throw new Error(e);
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
  ): Promise<T | undefined> {
    console.info("handleRequest", path, params);

    let data: T | undefined = undefined;
    const uri = params ? this.decorateUrl(params) : this.baseUrl!;
    let auth = decrypt(this.session.get(COOKIE_NAME)) as Authentication;

    const tryRequest = async (nosimulate: boolean): Promise<Response> => {
      console.info("Trying to fetch url ", uri);
      // @ts-ignore
      global.callCount++;
      // @ts-ignore
      if (!nosimulate && global.callCount % 2 == 0) {
        console.info("respond with 401 to simulate refresh");
        return new Promise((resolve) => {
          resolve(
            new Response(null, {
              status: 401,
            })
          );
        });
      }
      const ret = await fetch(uri, {
        method: body ? "POST" : "GET",
        headers: this.headers,
        body: body
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
      });
      console.info("Got status code response: ", ret.status, " for url ", uri);

      return ret;
    };

    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${auth.access_token}`,
    };
    let httpResponse: Response;

    httpResponse = await tryRequest(false);
    switch (httpResponse.status) {
      case 204:
        return {} as any;
        break;
      case 401:
        console.info("refresh token", auth.refresh_token);
        const oldRefreshToken = auth.refresh_token;
        // @ts-ignore
        let pendingPromise = global.pendingRefresh.get(auth.access_token);
        if (!pendingPromise) {
          console.info("pending promise not found, creating new");
          const openIdConfig = await getOpenIdConfig();
          pendingPromise = refreshToken(openIdConfig, auth);
          // @ts-ignore
          global.pendingRefresh.set(auth.refresh_token, pendingPromise);
        } else {
          console.info("pending promise retrieved, use it");
        }
        const refreshResponse = await pendingPromise;
        // @ts-ignore
        global.pendingRefresh.delete(oldRefreshToken);
        if (refreshResponse.status != 200) {
          console.info(await refreshResponse.json());
          throw new Error("Error refreshing token");
        }
        console.info("refresh token is ok");
        auth = await refreshResponse.json();
        console.info(auth);
        this.session.set(COOKIE_NAME, encrypt(auth));

        httpResponse = await tryRequest(true);
        switch (httpResponse.status) {
          case 204:
            return {} as any;
            break;
          case 401:
            throw new Error("not authenticated");
            break;
          default:
            const jsonResult = await httpResponse.json();
            data = path ? get(jsonResult, path) : jsonResult;
            break;
        }
        break;
      default:
        const jsonResult = await httpResponse.json();
        data = path ? get(jsonResult, path) : jsonResult;
        break;
    }

    console.info("return data: ", data);

    return data;
  }
}
