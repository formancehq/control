import { ActionFunction, json, redirect, Session } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { floor } from 'lodash';

import { logger } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import {
  exchangeToken,
  commitSession,
  COOKIE_NAME,
  encrypt,
  getOpenIdConfig,
  getSession,
  SessionHolder,
  withSession,
  refreshToken,
  parseSessionHolder,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder: SessionHolder = parseSessionHolder(session);

  const authentication = await getOpenIdConfig().then((config) =>
    refreshToken(config, sessionHolder.authentication.refresh_token)
  );
  sessionHolder.date = new Date();
  sessionHolder.authentication = authentication;
  session.set(COOKIE_NAME, encrypt(sessionHolder));

  return json(
    {
      interval: floor((authentication.expires_in * 1000) / 5),
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
