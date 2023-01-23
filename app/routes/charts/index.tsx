import { LoaderArgs, Response, json } from '@remix-run/node';
import { LoaderFunction, Session, useLoaderData } from 'remix';

import { LedgerInfo } from '~/src/types/ledger';
import { toBarChart } from '~/src/utils/aggregations/aggregations';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) =>
  // const res = await withSession(request, async (session: Session) => {
  //   const api = await createApiClient(session);
  //   return null;
  // });

  // return handleResponse(res);

  json({}, { status: 200 });
