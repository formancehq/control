import * as React from 'react';

import { Chip } from '@mui/material';
import { Session } from '@remix-run/node';
import { LoaderFunction, useLoaderData } from 'remix';

import { Date, Page, Row } from '@numaryhq/storybook';

import { paymentsAccounts } from '~/src/components/Layout/routes';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
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
        action={false}
        withPagination={false}
        columns={[
          // {
          //   label: 'ID',
          //   key: 'id',
          //   width: 10,
          // },
          {
            label: 'Provider',
            key: 'provider',
          },
          {
            label: 'Reference',
            key: 'reference',
          },
          {
            label: 'Type',
            key: 'type',
          },
          {
            label: 'Indexed At',
            key: 'indexedAt',
          },
        ]}
        renderItem={(account: Account, index: number) => (
          <Row
            key={index}
            keys={[
              // 'id',
              <ProviderPicture
                key={index}
                provider={account.provider || 'Generic'}
              />,
              'reference',
              <Chip key={index} label={account.type} variant="square" />,
              <Date key={index} timestamp={account.createdAt} />,
            ]}
            item={account}
          />
        )}
      ></Table>
    </Page>
  );
}
