import { redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import { Errors } from '~/src/types/generic';
import {
  commitSession,
  COOKIE_NAME,
  encrypt,
  exchangeToken,
  getOpenIdConfig,
  getSession,
  State,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateBase64 = url.searchParams.get('state');
  const buff = new Buffer(stateBase64!, 'base64');
  const state: State = JSON.parse(buff.toString('ascii'));
  const openIdConfig = await getOpenIdConfig();
  if (code) {
    // get through authentication callback
    const authentication = await exchangeToken(openIdConfig, code);
    const encryptedCookie = encrypt(authentication);
    session.set(COOKIE_NAME, encryptedCookie);

    return redirect(state.redirectTo || '/', {
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
