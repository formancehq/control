import { json, Session } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';

import { Authentication, CurrentUser } from '~/src/utils/api';
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
  OpenIdConfiguration,
  parseSessionHolder,
} from '~/src/utils/auth.server';
import {
  FavoriteMetadata,
  getFavorites,
  getStackApiUrl,
} from '~/src/utils/membership';

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));

  return await updateAccessToken(session);
};

export const updateAccessToken = async (
  session: Session
): Promise<
  undefined | Promise<Response & { json(): Promise<{ session: Session }> }>
> => {
  const sessionHolder = parseSessionHolder(session);
  if (sessionHolder.currentUser) {
    const openIdConfig = await getMembershipOpenIdConfig();
    const user = await getCurrentUser(
      openIdConfig,
      sessionHolder.master_access_token
    );

    const favorites = getFavorites(user);
    if (favorites) {
      const authentication = await getStackAuth(
        favorites,
        openIdConfig,
        sessionHolder.master_access_token,
        user
      );

      const cookie = createAuthCookie(
        user,
        sessionHolder.refresh_token,
        sessionHolder.expires_in,
        sessionHolder.master_access_token,
        authentication.access_token
      );
      session.set(COOKIE_NAME, encrypt(cookie));

      return json(session, {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    }
  }
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
