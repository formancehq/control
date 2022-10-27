import { redirect } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';

import { Authentication } from '~/src/utils/api';
import {
  getOpenIdConfig,
  getSession,
  introspect,
  parseSessionHolder,
  REDIRECT_URI,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder: Authentication = parseSessionHolder(session);
  const openIdConfig = await getOpenIdConfig();
  const intro = await introspect(openIdConfig, sessionHolder.access_token);
  if (intro && intro.active) {
    return redirect(
      `${openIdConfig.end_session_endpoint}?id_token_hint=${sessionHolder.access_token}&client_id=${process.env.CLIENT_ID}&post_logout_redirect_uri=${REDIRECT_URI}/auth/logout`
    );
  }

  return redirect(`${REDIRECT_URI}/auth/logout`);
};
