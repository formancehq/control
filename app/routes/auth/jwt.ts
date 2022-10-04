import { json } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import {
  COOKIE_NAME,
  decrypt,
  getJwtPayload,
  getSession,
  jwtExpired,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const cookie = request.headers.get('Authorization');
  const session = await getSession(request.headers.get('Cookie'));

  console.log('GET JWT COOKIE', session.get(COOKIE_NAME));

  if (cookie) {
    const decryptedCookie = decrypt(cookie);
    const payload = getJwtPayload(decryptedCookie);

    if (!jwtExpired(payload)) {
      return json({
        jwt: decryptedCookie.access_token,
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
