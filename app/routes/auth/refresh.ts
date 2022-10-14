import { json } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { floor } from 'lodash';

import { Authentication } from '~/src/utils/api';
import {
  commitSession,
  COOKIE_NAME,
  encrypt,
  getOpenIdConfig,
  getSession,
  parseSessionHolder,
  refreshToken,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder: Authentication = parseSessionHolder(session);

  const authentication = await getOpenIdConfig().then((config) =>
    refreshToken(config, sessionHolder.refresh_token)
  );
  session.set(COOKIE_NAME, encrypt(authentication));

  return json(
    {
      interval: floor((authentication.expires_in * 10) / 5),
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
