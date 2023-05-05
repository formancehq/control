import { redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import { Errors } from '~/src/types/generic';
import {
  commitSession,
  COOKIE_NAME,
  createAuthCookie,
  encrypt,
  getAccessTokenFromCode,
  getMembershipOpenIdConfig,
  getSession,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const openIdConfig = await getMembershipOpenIdConfig();
  if (code) {
    // get through authentication callback
    const authentication = await getAccessTokenFromCode(openIdConfig, code);
    const encryptedCookie = encrypt(createAuthCookie(authentication));

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
