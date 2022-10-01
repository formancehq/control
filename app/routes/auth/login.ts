import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { json } from 'remix';

import {
  authenticate,
  commitSession,
  COOKIE_NAME,
  encrypt,
  getOpenIdConfig,
  getSession,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const openIdConfig = await getOpenIdConfig();
  if (code && openIdConfig) {
    // get through authentication callback
    const authentication = await authenticate(openIdConfig, code, url);
    // handle cookie (encrypt)
    if (authentication && authentication.access_token) {
      const encryptedCookie = encrypt(authentication);
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

  return json(
    {},
    {
      status: 401,
    }
  );
};
