import { json } from "@remix-run/node";
import { LoaderFunction, TypedResponse } from "@remix-run/server-runtime";

import {
  COOKIE_NAME,
  destroySession,
  getSession,
} from "~/src/utils/auth.server";

export const loader: LoaderFunction = async ({
  request,
}): Promise<TypedResponse> => {
  console.log("destroy passe");
  const session = await getSession(request.headers.get("Cookie"));
  const cookie = session.get(COOKIE_NAME);
  console.log("DATA SESSION DESTROY", session.data, cookie);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    }
  );
};
