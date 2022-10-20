import { ActionFunction, json, Session } from '@remix-run/node';

import { createApiClient } from '~/src/utils/api.server';
import { withSession } from '~/src/utils/auth.server';

export const action: ActionFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const body = await request.json();

    const apiClient = await createApiClient(session, process.env.API_URL);
    let ret;

    switch (request.method) {
      case 'POST':
        ret = await apiClient.postResource(body.params, body.body, body.path);
        break;
      case 'GET':
        ret = await apiClient.getResource(body.params, body.body);
        break;
      default:
        throw new Error('Method not handled');
    }

    return ret;
  }

  const result = await withSession(request, handleData);

  throw json(result.callbackResult, {
    headers: result.cookieValue
      ? {
          'Set-Cookie': result.cookieValue,
        }
      : {},
  });
};
