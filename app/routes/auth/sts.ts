import { json } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { floor } from 'lodash';

import { Authentication, CurrentUser } from '~/src/utils/api';
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
  OpenIdConfiguration,
  parseSessionHolder,
} from '~/src/utils/auth.server';
import {
  FavoriteMetadata,
  getFavorites,
  getStackApiUrl,
} from '~/src/utils/membership';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder = parseSessionHolder(session);

  if (sessionHolder.currentUser) {
    const openIdConfig = await getMembershipOpenIdConfig();
    const favorites = getFavorites(sessionHolder.currentUser);
    if (favorites) {
      const authentication = await getStackAuth(
        favorites,
        openIdConfig,
        sessionHolder.master_access_token,
        sessionHolder.currentUser
      );

      const cookie = createAuthCookie(
        sessionHolder.currentUser,
        sessionHolder.refresh_token,
        sessionHolder.expires_in,
        sessionHolder.master_access_token,
        authentication.access_token
      );
      session.set(COOKIE_NAME, encrypt(cookie));

      return json(
        {
          interval: floor((299 * 1000) / 5),
        },
        {
          headers: {
            'Set-Cookie': await commitSession(session),
          },
        }
      );
    }
  }

  return null;
};

export const getStackAuth = async (
  favorites: FavoriteMetadata,
  openIdConfig: OpenIdConfiguration,
  masterToken: string,
  currentUser: CurrentUser
): Promise<Authentication> => {
  const audience = `stack://${favorites?.organizationId}/${favorites?.stackId}`;
  const securityToken = await getSecurityToken(
    openIdConfig,
    audience,
    masterToken
  );
  const apiUrl = getStackApiUrl(currentUser);

  return await getAuthStackOpenIdConfig(apiUrl!).then((config) =>
    exchangeToken(config, securityToken.access_token)
  );
};
