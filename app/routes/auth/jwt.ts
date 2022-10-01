import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { json } from 'remix';

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
  const session = await getSession(request.headers.get('Cookie'));
  const cookie = session.get(COOKIE_NAME);
  const decryptedCookie = decrypt(cookie);
  const payload = getJwtPayload(decryptedCookie);
  if (!jwtExpired(payload)) {
    return json({
      jwt: decryptedCookie.access_token,
    });
  }

  return json(
    {},
    {
      status: 401,
    }
  );
};
