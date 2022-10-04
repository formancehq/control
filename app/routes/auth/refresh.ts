import { json } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import {
  COOKIE_NAME,
  decrypt,
  encrypt,
  getOpenIdConfig,
  getSession,
  refreshToken,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse | undefined> => {
  const cookie = request.headers.get('Authorization');
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const openIdConfig = await getOpenIdConfig();
  if (openIdConfig && cookie) {
    const decryptedCookie = decrypt(cookie);
    const refreshedToken = await refreshToken(
      openIdConfig,
      url,
      decryptedCookie
    );
    const jsonResult = await refreshedToken.json();

    if (refreshedToken) {
      if (
        refreshedToken.status === 401 ||
        refreshedToken.status === 400 ||
        jsonResult.error
      ) {
        // const test = await destroySession(session);
        // console.log("REFRESH ERROR", test);
        // console.log("DATA SESSION REFRESH", session.data);
        // return redirect("/", {
        //   headers: {
        //     "Set-Cookie": await commitSession(session),
        //   },
        // });
        // const destroy = await fetch("http://localhost:3000/auth/destroy");
        // return destroy;
      } else {
        const encryptedCookie = encrypt(jsonResult);
        session.set(COOKIE_NAME, encryptedCookie);
        console.log('REFRESH SUCCESS');

        return json(
          { cookie: encryptedCookie },
          {
            // headers: {
            //   "Set-Cookie": await commitSession(session),
            // },
          }
        );
      }
    }
  } else {
    return json(
      {},
      {
        status: 401,
      }
    );
  }
};
