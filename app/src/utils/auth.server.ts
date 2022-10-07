import crypto from "crypto";

import { createCookieSessionStorage, json, Session } from "@remix-run/node";
import { TypedResponse } from "@remix-run/server-runtime";

import { ObjectOf } from "~/src/types/generic";
import {
  API_AUTH,
  Authentication,
  JwtPayload,
  logger,
  returnHandler,
  SessionWrapper,
} from "~/src/utils/api";
import { redirect } from "remix";

export const COOKIE_NAME = "auth_session";
export const AUTH_CALLBACK_ROUTE = "/auth/login";
const FROM = "utils/auth.server";

export interface SessionHolder {
  authentication: Authentication;
  date: Date;
}

export const parseSessionHolder = (session: Session): SessionHolder => {
  const cookieValue = decrypt<
    SessionHolder & {
      date: string;
    }
  >(session.get(COOKIE_NAME));
  return {
    authentication: cookieValue.authentication,
    date: new Date(cookieValue.date),
  };
};

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: COOKIE_NAME, // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.CLIENT_SECRET || "secret"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production",
  },
});

export const encrypt = (payload: any): string => {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, "salt", 32);
  const iv = process.env.ENCRYPTION_IV!;

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
};

export const decrypt = <T>(cookie: string): T => {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, "salt", 32);
  const iv = process.env.ENCRYPTION_IV!;
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = decipher.update(cookie, "base64", "utf8");

  return JSON.parse(decrypted + decipher.final("utf8"));
};

export interface OpenIdConfiguration {
  authorization_endpoint: string;
  userinfo_endpoint: string;
  token_endpoint: string;
}

export const getOpenIdConfig = async (): Promise<OpenIdConfiguration> => {
  const uri = `${process.env.API_URL}${API_AUTH}/.well-known/openid-configuration`;
  return fetch(uri)
    .catch((e) => {
      throw new Error(
        "Unable to fetch OIDC discovery on " + uri + ": " + e.toString()
      );
    })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Unexpected status code " +
            response.status +
            " when fetching openid config"
        );
      }
      return response.json();
    });
};

export const getJwtPayload = (
  decryptedCookie: Authentication
): JwtPayload | undefined => {
  return JSON.parse(
    Buffer.from(decryptedCookie.access_token.split(".")[1], "base64").toString()
  );
};

export const exchangeToken = async (
  openIdConfig: ObjectOf<any>,
  code: string,
  url: URL
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${url.origin}${AUTH_CALLBACK_ROUTE}`;
  return await fetch(uri).then((response) => {
    if (response.status != 200) {
      throw new Error(
        "Unexpected status code " +
          response.status +
          " when refreshing token, body: " +
          response.text()
      );
    }
    return response.json();
  });
};

export const refreshToken = async (
  openIdConfig: OpenIdConfiguration,
  refreshToken: string
): Promise<Authentication> => {
  const uri = `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${refreshToken}`;
  return fetch(uri).then(async (response) => {
    if (response.status != 200) {
      throw new Error(
        "Unexpected status code " +
          response.status +
          " when refreshing token, body: " +
          (await response.text())
      );
    }
    return await response.json();
  });
};

export interface State {
  redirectTo: string;
}

export const triggerAuthenticationFlow = (
  url: URL,
  openIdConfiguration: OpenIdConfiguration,
  redirectTo: string
) => {
  const stateObject: State = { redirectTo };
  let buff = new Buffer(JSON.stringify(stateObject));
  let stateAsBase64 = buff.toString("base64");

  const redirectUrl = new URL(openIdConfiguration.authorization_endpoint);
  redirectUrl.searchParams.set("client_id", process.env.CLIENT_ID as string); // Env vars should not be used anywhere in the application, centralize at least inside a config object
  redirectUrl.searchParams.set(
    "redirect_uri",
    `${url.origin}${AUTH_CALLBACK_ROUTE}`
  );
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("scope", "openid email offline_access");
  redirectUrl.searchParams.set("state", stateAsBase64);

  redirect(redirectUrl.toString());
};

export const handleResponse = async (
  data: SessionWrapper
): Promise<TypedResponse<any>> => {
  if(data.cookieValue) {
    console.info('New cookie value received, write it');
  }
  return json(data.callbackResult, {
    headers: data.cookieValue ? {
      "Set-Cookie": data.cookieValue,
    } : {},
  });
};

export const withSession = async (
  request: Request,
  callback: (session: Session) => any
): Promise<SessionWrapper> => {
  const session = await getSession(request.headers.get("Cookie"));
  const c = await callback(session);
  const commitSession = await sessionStorage.commitSession(session);
  const commitSessionCookieValue = commitSession.split(";")[0]

  if(request.headers.get("Cookie") != commitSessionCookieValue) {
    console.info('original cookie: ', request.headers.get("Cookie"))
    console.info('Committed session: ', commitSessionCookieValue)
  }

  return {
    cookieValue: request.headers.get("Cookie") != commitSessionCookieValue ? commitSession : undefined,
    callbackResult: c,
  };
};

export const { getSession, destroySession, commitSession } = sessionStorage;

export class UnauthenticatedError extends Error {
  constructor() {
    super("Unauthenticated");
  }
}

export class RefreshingTokenError extends Error {
  constructor() {
    super("Error while refreshing access token");
  }
}
