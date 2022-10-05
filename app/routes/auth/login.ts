import { json, redirect } from "@remix-run/node";
import { LoaderFunction, TypedResponse } from "@remix-run/server-runtime";

import {
  authenticate,
  commitSession,
  COOKIE_NAME,
  encrypt,
  getOpenIdConfig,
  getSession,
} from "~/src/utils/auth.server";

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const openIdConfig = await getOpenIdConfig();
  if (code && openIdConfig) {
    console.info("first if");
    // get through authentication callback
    const authentication = await authenticate(openIdConfig, code, url);
    console.info(authentication);
    // handle cookie (encrypt)
    if (authentication && authentication.error) {
      console.error(authentication.error, authentication.error_description);
    }
    if (authentication && authentication.access_token) {
      console.info("second if");
      const encryptedCookie = encrypt(authentication);
      session.set(COOKIE_NAME, encryptedCookie);

      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  return json(
    {},
    {
      status: 401,
    }
  );
};
