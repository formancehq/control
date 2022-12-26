import * as React from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import {
  Chip,
  Date,
  JsonViewer,
  ObjectOf,
  Page,
  Row,
} from '@numaryhq/storybook';

import Table from '~/src/components/Wrappers/Table';
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
  const { t } = useTranslation();
  const logs = useLoaderData<string[]>();

  return (
    <Page id="ledgerLogs">
      <Table
        id="ledger-logs-list"
        items={logs}
        columns={[
          {
            key: 'type',
            label: t('pages.ledger.logs.table.columnLabel.type'),
            width: 10,
          },
          {
            key: 'date',
            label: t('pages.ledger.logs.table.columnLabel.date'),
            width: 5,
          },
          {
            key: 'hash',
            label: t('pages.ledger.logs.table.columnLabel.hash'),
            width: 5,
          },
          {
            key: 'data',
            label: t('pages.ledger.logs.table.columnLabel.data'),
            width: 90,
          },
        ]}
        renderItem={(
          log: LedgerLog<Transaction | ObjectOf<any>>,
          index: number
        ) => (
          <Row
            key={index}
            keys={[
              <Chip
                key={index}
                label={log.type}
                variant="square"
                color="yellow"
              />,
              <Date key={index} timestamp={log.date} />,
              <Chip
                key={index}
                label={log.hash}
                variant="square"
                color="blue"
              />,
              <JsonViewer key={index} jsonData={log.data} expanded={false} />,
            ]}
            item={log}
          />
        )}
      />
    </Page>
  );
}
