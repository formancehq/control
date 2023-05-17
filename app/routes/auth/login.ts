import { redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { get, isEmpty } from 'lodash';

import { getStackAuth } from '~/routes/auth/sts';
import { Errors } from '~/src/types/generic';
import { MembershipStack } from '~/src/types/stack';
import {
  commitSession,
  COOKIE_NAME,
  createAuthCookie,
  encrypt,
  getAccessTokenFromCode,
  getAuthStackOpenIdConfig,
  getCurrentUser,
  getMembershipOpenIdConfig,
  getSession,
} from '~/src/utils/auth.server';
import {
  createFavoriteMetadata,
  FavoriteMetadata,
  getFavorites,
  getStackApiUrl,
  getStacks,
  UpdateMetadata,
  updateUserMetadata,
} from '~/src/utils/membership';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const openIdConfig = await getMembershipOpenIdConfig();
  if (code) {
    // get through authentication callback
    const masterAuth = await getAccessTokenFromCode(openIdConfig, code);
    const user = await getCurrentUser(openIdConfig, masterAuth.access_token);
    let favorites: FavoriteMetadata | UpdateMetadata | undefined =
      getFavorites(user);
    let stackAuth = undefined;
    const stacks: MembershipStack[] = await getStacks(
      undefined,
      masterAuth.access_token
    );
    if (!favorites || isEmpty(favorites)) {
      if (stacks.length > 0) {
        favorites = createFavoriteMetadata(get(stacks[0], 'uri'));
        await updateUserMetadata(
          undefined,
          favorites as UpdateMetadata,
          undefined,
          masterAuth.access_token
        );
      }
    } else {
      const stackUrl = getStackApiUrl(user);
      if (stackUrl) {
        try {
          await getAuthStackOpenIdConfig(stackUrl);
        } catch {
          favorites = {};
          await updateUserMetadata(
            undefined,
            favorites as UpdateMetadata,
            undefined,
            masterAuth.access_token
          );
        }
      }
    }
    if (favorites && 'stackUrl' in favorites && stacks.length > 0) {
      stackAuth = await getStackAuth(
        favorites,
        openIdConfig,
        masterAuth.access_token,
        user
      );
    }

    const cookie = createAuthCookie(
      user,
      masterAuth.refresh_token,
      masterAuth.expires_in,
      masterAuth.access_token,
      stackAuth?.access_token
    );

    const encryptedCookie = encrypt(cookie);

    session.set(COOKIE_NAME, encryptedCookie);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return redirect(
    `${process.env.REDIRECT_URI}?error_type=${
      Errors.AUTH
    }&error=${url.searchParams.get(
      'error'
    )}&error_description=${url.searchParams.get('error_description')}`
  );
};
