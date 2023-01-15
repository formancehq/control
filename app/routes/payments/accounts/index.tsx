import * as React from 'react';

import { Session } from '@remix-run/node';
import { LoaderFunction, useLoaderData } from 'remix';

import { Page, Row } from '@numaryhq/storybook';

import { paymentsAccounts } from '~/src/components/Layout/routes';
import Table from '~/src/components/Wrappers/Table';
import { Cursor } from '~/src/types/generic';
import { Account } from '~/src/types/payment';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const res = await withSession(request, async (session: Session) => {
    const api = await createApiClient(session);
    const url = `${API_PAYMENT}/accounts`;
    const res = await api.getResource<Cursor<Account>>(url, 'cursor');

    return res?.data;
  });

  return handleResponse(res);
};

export default function Index() {
  const accounts = useLoaderData<Account[]>();

  return (
    <Page id={paymentsAccounts.id}>
      <Table
        id="payments-accounts-list"
        items={accounts}
        action={true}
        withPagination={false}
        columns={[
          {
            label: 'ID',
            key: 'id',
            width: 10,
          },
          {
            label: 'Provider',
            key: 'provider',
            width: 1,
          },
          {
            label: 'Type',
            key: 'type',
            width: 1,
          },
          {
            label: 'Reference',
            key: 'reference',
            width: 10,
          },
        ]}
        renderItem={(item: Account, index: number) => (
          <Row
            key={index}
            keys={['id', 'provider', 'type', 'reference']}
            item={item}
          />
        )}
      ></Table>
    </Page>
  );
}
