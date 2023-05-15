import { ActionFunction, json, Session } from '@remix-run/node';

import { Methods } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { withSession } from '~/src/utils/auth.server';

export const action: ActionFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const body = await request.json();

    const apiClient = await createApiClient(
      session,
      body.baseUrl,
      body.masterToken
    );

    let ret;

    switch (body.method) {
      case Methods.POST:
        ret = await apiClient.postResource(body.params, body.body, body.path);
        break;
      case Methods.GET:
        ret = await apiClient.getResource(body.params, body.body);
        break;
      case Methods.PUT:
        ret = await apiClient.putResource(body.params, body.path, body.body);
        break;
      case Methods.DELETE:
        ret = await apiClient.deleteResource(body.params, body.path);
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
