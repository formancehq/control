import { json, redirect } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import { logger } from '~/src/utils/api';
import {
  exchangeToken,
  commitSession,
  COOKIE_NAME,
  encrypt,
  getOpenIdConfig,
  getSession,
  SessionHolder,
} from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const openIdConfig = await getOpenIdConfig();
  // TODO: Extract state parameter and redirect to the good url
  if (code) {
    // get through authentication callback
    const authentication = await exchangeToken(openIdConfig, code, url);
    const encryptedCookie = encrypt({
      authentication,
      date: new Date(),
    } as SessionHolder);
    session.set(COOKIE_NAME, encryptedCookie);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return json(
    {},
    {
      status: 401,
    }
  );
};
