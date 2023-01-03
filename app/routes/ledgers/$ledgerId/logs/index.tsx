import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';

import { ObjectOf, Page } from '@numaryhq/storybook';

import LedgerLogList from '~/src/components/Wrappers/Lists/LedgerLogList';
import { Cursor } from '~/src/types/generic';
import { LedgerLog, Transaction } from '~/src/types/ledger';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { QueryContexts, sanitizeQuery } from '~/src/utils/search';

export const meta: MetaFunction = () => ({
  title: 'Ledger logs',
  description: 'List',
});

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.ledgerId, 'Expected params.ledgerId');
    const api = await createApiClient(session);
    const query = sanitizeQuery(request, QueryContexts.PARAMS);
    const url = `/ledger/${params.ledgerId}/log?${query}`;
    const logs = await api.getResource<
      Cursor<LedgerLog<Transaction | ObjectOf<any>>>
    >(url, 'cursor');
    if (logs) {
      return logs;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const logs = useLoaderData<
    Cursor<LedgerLog<Transaction | ObjectOf<any>>>
  >() as unknown as Cursor<LedgerLog<Transaction | ObjectOf<any>>>;

  return (
    <Page id="ledgerLogs">
      <LedgerLogList logs={logs} />
    </Page>
  );
}
