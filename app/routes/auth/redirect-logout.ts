import { redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import { Authentication } from '~/src/utils/api';
import {
  getOpenIdConfig,
  getSession,
  parseSessionHolder,
  REDIRECT_URI,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder: Authentication = parseSessionHolder(session);
  const openIdConfig = await getOpenIdConfig();

  return redirect(
    `${openIdConfig.end_session_endpoint}?id_token_hint=${sessionHolder.id_token}&client_id=${process.env.CLIENT_ID}&post_logout_redirect_uri=${REDIRECT_URI}/auth/logout`
  );
};
