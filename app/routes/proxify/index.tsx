import * as React from 'react';

import { json } from '@remix-run/node';
import { TypedResponse } from '@remix-run/server-runtime';
import { ActionFunction } from 'remix';

import { ApiClient } from '~/src/utils/api';

interface ProxyRequest {
  method: string;
  params?: string;
  body?: any;
  path?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const body = (await (
    json(request.body) as TypedResponse<ProxyRequest>
  ).json()) as ProxyRequest;
  const apiClient = new ApiClient(process.env.API_URL_BACK as string, request);
  let ret;
  switch (request.method) {
    case 'POST':
      ret = await apiClient.postResource(body.params, body.body, body.path);
    case 'GET':
      ret = await apiClient.getResource(body.params, body.body);
  }

  return json(ret, 200);
};
