export const API_SEARCH = "/search";
export const API_LEDGER = "/ledger";
export const API_PAYMENT = "/payments";
export const API_AUTH = "/auth";

export interface ApiClient {
  postResource: <T>(
    params: string,
    body: any,
    path?: string
  ) => Promise<T | undefined>;
  getResource: <T>(params: string, path?: string) => Promise<T | undefined>;
}

export type SessionWrapper = {
  cookieValue?: string;
  callbackResult: any;
};
export type CurrentUser = {
  sub: string;
  scp: string[];
  email: string;
  email_verified: boolean;
};
export type Authentication = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id_token: string;
  error?: string;
  error_description?: string;
};
export type JwtPayload = {
  sub: string;
  aud: string[];
  jti: string;
  exp: number;
  iat: number;
  nbf: number;
  scp?: string[]; // TODO make it required once permissions from backend are set
};

export const logger = (
  stack?: any,
  from?: string,
  response?: any,
  request?: any
) => {
  // eslint-disable-next-line no-console
  console.error({
    from: from || "utils/api",
    request,
    response,
    stack,
    page: typeof window !== "undefined" ? window.location : "",
  });
};

export const returnHandler = async <T>(
  response?: Response,
  from = "utils/api"
): Promise<undefined | T> => {
  if (response && response?.status === 200) {
    return (await response.json()) as T;
  } else {
    logger(
      undefined,
      from,
      { status: response?.status },
      {
        url: response?.url,
      }
    );

    return undefined;
  }
};
