import { redirect } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';

import { destroySession, getSession } from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
      'Clear-SiteData': 'cache',
    },
  });
};
