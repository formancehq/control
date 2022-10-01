import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { json, redirect } from 'remix';

import {
  commitSession,
  COOKIE_NAME,
  destroySession,
  encrypt,
  getOpenIdConfig,
  getSession,
  refreshToken,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse | undefined> => {
  const session = await getSession(request.headers.get('Cookie'));
  const cookie = session.get(COOKIE_NAME);
  const url = new URL(request.url);
  const openIdConfig = await getOpenIdConfig();
  if (openIdConfig && cookie) {
    const refreshedToken = await refreshToken(openIdConfig, url, cookie);
    const json = await refreshedToken.json();
    if (refreshedToken) {
      if (refreshedToken.status === 401 || json.error) {
        return redirect('/', {
          headers: {
            'Set-Cookie': await destroySession(session),
          },
        });
      } else {
        const encryptedCookie = encrypt(json);
        session.set(COOKIE_NAME, encryptedCookie);

        return json(
          {},
          {
            headers: {
              'Set-Cookie': await commitSession(session),
            },
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
