import { redirect } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';

import { Errors } from '~/src/types/generic';
import {
  getMembershipOpenIdConfig,
  getSession,
  introspect,
  parseSessionHolder,
  REDIRECT_URI,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  const session = await getSession(request.headers.get('Cookie'));
  const sessionHolder = parseSessionHolder(session);
  console.log(sessionHolder);
  try {
    const openIdConfig = await getMembershipOpenIdConfig();
    const intro = await introspect(
      openIdConfig,
      sessionHolder.master_access_token,
      process.env.MEMBERSHIP_CLIENT_ID!,
      process.env.MEMBERSHIP_CLIENT_SECRET
    );

    if (intro && intro.active) {
      return redirect(
        `${openIdConfig.end_session_endpoint}?id_token_hint=${sessionHolder.master_access_token}&client_id=${process.env.MEMBERSHIP_CLIENT_ID}&post_logout_redirect_uri=${REDIRECT_URI}/auth/logout`
      );
    }
  } catch (e) {
    console.log(e);

    return redirect(`${process.env.REDIRECT_URI}?error_type=${Errors.AUTH}`);
  }

  return redirect(`${REDIRECT_URI}/auth/logout`);
};
