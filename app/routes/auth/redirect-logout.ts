import { redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import { Authentication } from '~/src/utils/api';
import {
  getOpenIdConfig,
  getSession,
  parseSessionHolder,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder: Authentication = parseSessionHolder(session);
  const openIdConfig = await getOpenIdConfig();
  const url = new URL(request.url);

  return redirect(
    `${openIdConfig.end_session_endpoint}?id_token_hint=${sessionHolder.id_token}&client_id=${process.env.CLIENT_ID}&post_logout_redirect_uri=${url.origin}/auth/logout`
  );
};
