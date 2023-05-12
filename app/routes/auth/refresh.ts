import { json } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { floor, get } from 'lodash';

import {
  commitSession,
  COOKIE_NAME,
  createAuthCookie,
  encrypt,
  exchangeToken,
  getAuthStackOpenIdConfig,
  getCurrentUser,
  getMembershipOpenIdConfig,
  getSecurityToken,
  getSession,
  parseSessionHolder,
  refreshToken,
} from '~/src/utils/auth.server';
import { getFavorites } from '~/src/utils/membership';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder = parseSessionHolder(session);
  const openIdConfig = await getMembershipOpenIdConfig();
  const audience = 'stack://qqaoixccdziy/cxun';
  const user = await getCurrentUser(openIdConfig, sessionHolder.access_token);
  const apiUrl = get(getFavorites(user), 'stackUrl');
  const refreshAuth = await refreshToken(
    openIdConfig,
    sessionHolder.refresh_token
  );

  const securityToken = await getSecurityToken(
    openIdConfig,
    audience,
    refreshAuth.access_token
  );
  const authentication = await getAuthStackOpenIdConfig(apiUrl!).then(
    (config) => exchangeToken(config, securityToken.access_token)
  );

  session.set(
    COOKIE_NAME,
    encrypt(
      createAuthCookie(
        { ...authentication, refresh_token: refreshAuth.refresh_token },
        apiUrl!,
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
