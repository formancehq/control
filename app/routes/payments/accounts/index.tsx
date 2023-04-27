import * as React from 'react';

import { Chip } from '@mui/material';
import { MetaFunction, Session } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import { LoaderFunction, useLoaderData } from 'remix';

import { Date, Page, Row } from '@numaryhq/storybook';

import { paymentsAccounts as paymentsAccountsConfig } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { FEATURES } from '~/src/contexts/service';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
import { Cursor } from '~/src/types/generic';
import { Account } from '~/src/types/payment';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Payments accounts',
  description: 'Show a list',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={paymentsAccountsConfig.id}
      title="pages.paymentsAccounts.title"
      error={error}
    />
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const res = await withSession(request, async (session: Session) => {
    const api = await createApiClient(session);
    const url = `${API_PAYMENT}/accounts`;

    return await api.getResource<Cursor<Account>>(url, 'cursor.data');
  });

  return handleResponse(res);
};

export default function Index() {
  const accounts = useLoaderData<Account[]>();
  const { t } = useTranslation();
  useFeatureFlag(FEATURES.PAYMENTS_ACCOUNT);

  return (
    <Page id={paymentsAccountsConfig.id}>
      <Table
        id="payments-accounts-list"
        items={accounts}
        action={false}
        withPagination={false}
        columns={[
          {
            label: t('pages.paymentsAccounts.table.columnLabel.provider'),
            key: 'provider',
            width: 20,
          },
          {
            label: t('pages.paymentsAccounts.table.columnLabel.reference'),
            key: 'reference',
            width: 40,
          },
          {
            label: t('pages.paymentsAccounts.table.columnLabel.type'),
            key: 'type',
            width: 25,
          },
          {
            label: t('pages.paymentsAccounts.table.columnLabel.indexedAt'),
            key: 'indexedAt',
            width: 15,
          },
        ]}
        renderItem={(account: Account, index: number) => (
          <Row
            key={index}
            keys={[
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
