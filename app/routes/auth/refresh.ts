import { json } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { floor } from 'lodash';

import {
  commitSession,
  COOKIE_NAME,
  createAuthCookie,
  encrypt,
  exchangeToken,
  getAuthStackOpenIdConfig,
  getMembershipOpenIdConfig,
  getSecurityToken,
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
  const audience = 'stack://qqaoixccdziy/cxun';
  const securityToken = await getSecurityToken(
    openIdConfig,
    audience,
    refreshAuth.access_token
  );
  const authentication = await getAuthStackOpenIdConfig().then((config) =>
    exchangeToken(config, securityToken.access_token)
  );
  session.set(
    COOKIE_NAME,
    encrypt(
      createAuthCookie(
        { ...authentication, refresh_token: refreshAuth.refresh_token },
        refreshAuth.access_token
      )
    )
  );

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
