import * as React from "react";

import { json } from "@remix-run/node";
import { ActionFunction } from "remix";

import { createApiClient } from "~/src/utils/api.server";
import { commitSession, getSession } from "~/src/utils/auth.server";

interface ProxyRequest {
  method: string;
  params?: string;
  body?: any;
  path?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.json();
  console.info("proxy handle request", body);
  const apiClient = await createApiClient(request, process.env.API_URL_BACK);
  let ret;

  switch (request.method) {
    case "POST":
      ret = await apiClient.postResource(body.params, body.body, body.path);
      break;
    case "GET":
      ret = await apiClient.getResource(body.params, body.body);
      break;
  }

  return json(ret, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
