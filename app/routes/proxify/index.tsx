import * as React from 'react';

import { ActionFunction } from '@remix-run/node';

import { createApiClient } from '~/src/utils/api.server';
import {
  getSession,
  handleResponse,
  withSession,
} from '~/src/utils/auth.server';

export const action: ActionFunction = async ({ request }) => {
  async function handleData() {
    const session = await getSession(request.headers.get('Cookie'));
    const body = await request.json();

    const apiClient = await createApiClient(request, process.env.API_URL);
    let ret;

    switch (request.method) {
      case 'POST':
        ret = await apiClient.postResource(body.params, body.body, body.path);
        break;
      case 'GET':
        ret = await apiClient.getResource(body.params, body.body);
        break;
    }

    return ret;
  }

  return handleResponse(await withSession(request, handleData));
};
