import { json } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { floor } from 'lodash';

import {
  commitSession,
  COOKIE_NAME,
  createAuthCookie,
  encrypt,
  getCurrentUser,
  getMembershipOpenIdConfig,
  getSession,
  parseSessionHolder,
  refreshToken,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder = parseSessionHolder(session);

  const openIdConfig = await getMembershipOpenIdConfig();
  const refreshAuth = await refreshToken(
    openIdConfig,
    sessionHolder.refresh_token
  );
  const user = await getCurrentUser(openIdConfig, refreshAuth.access_token);
  const cookie = createAuthCookie(
    user,
    refreshAuth.refresh_token,
    refreshAuth.expires_in,
    refreshAuth.access_token,
    sessionHolder.access_token
  );

  session.set(COOKIE_NAME, encrypt(cookie));

  return json(
    {
      interval: floor((refreshAuth.expires_in * 1000) / 6),
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
