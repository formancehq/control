import { get } from "lodash";
import { Errors } from "~/src/types/generic";
import { COOKIE_NAME, getSession } from "~/src/utils/auth.server";

export const API_SEARCH = "/search";
export const API_LEDGER = "/ledger";
export const API_PAYMENT = "/payments";
export const API_AUTH = "/auth";

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
  baseUrl: string;
  decorateUrl: (uri: string) => string;
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined>;
  getResource: <T>(params: string, path?: string) => Promise<T | undefined>;
  throwError: (stack?: any, from?: string, response?: Response) => Error;
}

export class ApiClient implements IApiClient {
  public baseUrl: string;
  public auth: string | Request | undefined;
  public authSetter: any;
  protected headers: Headers;

  constructor(url?: string, auth?: any, authSetter?: any) {
    this.baseUrl = url || "http://localhost/";
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
    this.authSetter = authSetter;
    this.auth = auth;
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
    let data: T | undefined = undefined;
    let res: Response | undefined = undefined;
    const uri = params ? this.decorateUrl(params) : this.baseUrl;
    const isServer = typeof this.auth !== "string";
    if (isServer && this.auth) {
      const session = await getSession(
        (this.auth as Request).headers.get("Cookie")
      );
      this.auth = session.get(COOKIE_NAME);
    }
    const jwt = await fetch("http://localhost:3000/auth/jwt", {
      credentials: "include",
      // headers: {
      //   Authorization: this.auth as string,
      // },
    }); // TODO replace hardcoded localhost
    console.log(jwt.status);
    // if (jwt.status === 401) {
    //   const refresh = await axios.get("http://localhost:3000/auth/refresh", {
    //     credentials: "include",
    //     headers: {
    //       Authorization: this.auth as string,
    //     },
    //   }); // TODO replace hardcoded localhost
    //   // console.log("reffrresh", refresh);
    //   // const json = await refresh.json();
    //   // console.log("json", json);
    //   // this.authSetter(json.cookie);
    // }

    // this.headers = { ...this.headers, Authorization: `Bearer ${jwt}` };
    this.headers = { ...this.headers, Authorization: `Bearer ` };
    try {
      if (body) {
        res = await fetch(uri, {
          method: "POST",
          headers: this.headers,
          body: body instanceof FormData ? body : JSON.stringify(body),
        });
      } else {
        res = await fetch(uri, { headers: this.headers });
      }
      if (res && res.status === 204) {
        return {} as any;
      }

      const json = await res.json();

      data = path ? get(json, path) : json;
    } catch (e: any) {
      // TODO backend need to fix the search 503 api error !!!!!!!!
      // remove this mock once backend search is fixed
      if (params === API_SEARCH && res?.status === 503) {
        return {} as any;
      }
      if (res?.status === 401 || res?.status === 400 || res?.status === 403) {
        // await fetch("http://localhost:3000/auth/refresh"); // TODO replace hardcoded localhost
      }

      this.throwError(e, undefined, res);
    }

    if (!data && res && res.status !== 204) {
      this.throwError(undefined, undefined, res);
    }

    if (data) {
      return data;
    }
  }
}
