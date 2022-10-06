import { json } from '@remix-run/node';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';

import { destroySession, getSession } from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  const session = await getSession(request.headers.get('Cookie'));

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    }
  );
};
