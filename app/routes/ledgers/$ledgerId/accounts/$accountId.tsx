import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Page, Row, SectionWrapper } from '@numaryhq/storybook';
import { Box, Typography, useTheme } from '@mui/material';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { API_LEDGER, API_SEARCH, ApiClient } from '~/src/utils/api';
import {
  Account,
  AccountHybrid,
  Balance,
  LedgerResources,
  Transaction,
  Volume,
} from '~/src/types/ledger';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Metadata from '~/src/components/Wrappers/Metadata';
import { prettyJson } from '~/src/components/Wrappers/Metadata/service';
import { getLedgerAccountDetailsRoute } from '~/src/components/Navbar/routes';
import Table from '~/src/components/Wrappers/Table';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { Cursor } from '~/src/types/generic';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';

const normalizeBalance = (account: Account): AccountHybrid => ({
  balances: account.balances
    ? (Object.keys(account.balances).map((key: string) => ({
        asset: key,
        value: account.balances[key],
      })) as Balance[])
    : [],
  volumes: account.volumes
    ? (Object.keys(account.volumes).map((key) => ({
        asset: key,
        received: account.volumes[key].input,
        sent: account.volumes[key].output,
      })) as Volume[])
    : [],
  metadata: [{ value: prettyJson(account.metadata) }],
});

export const meta: MetaFunction = () => ({
  title: 'Account',
  description: 'Show an account',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="account"
      title="pages.ledgers.account.title"
      error={error}
    />
  );
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<{
  account: AccountHybrid;
  transactions: Cursor<Transaction> | undefined;
} | null> => {
  invariant(params.ledgerId, 'Expected params.ledgerId');
  invariant(params.accountId, 'Expected params.accountId');
  const api = new ApiClient();
  const account = await api.getResource<Account>(
    `${API_LEDGER}/${params.ledgerId}/${LedgerResources.ACCOUNTS}/${params.accountId}`,
    'data'
  );
  const transactions = await api.postResource<Cursor<Transaction>>(
    API_SEARCH,
    {
      size: 5,
      policy: SearchPolicies.OR,
      terms: [`destination=${params.accountId}`, `source=${params.accountId}`],
      target: SearchTargets.TRANSACTION,
    },
    'cursor'
  );

  if (account)
    return {
      account: normalizeBalance(account),
      transactions,
    };

  return null;
};

export default function Index() {
  const loaderData = useLoaderData<{
    account: AccountHybrid;
    transactions: Cursor<Transaction>;
  }>();
  const { accountId: id, ledgerId } = useParams<{
    accountId: string;
    ledgerId: string;
  }>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const account = fetcher.data?.account || loaderData.account;
  const { palette } = useTheme();

  const sync = () => {
    fetcher.load(getLedgerAccountDetailsRoute(id!, ledgerId!));
  };

  const renderValue = (value: number, color: string) => (
    <Typography sx={{ color }} variant="money">
      {value}
    </Typography>
  );

  return (
    <Page id="account" title={t('pages.account.title')}>
      <>
        <Box display="flex" justifyContent="space-between" mb={3}>
          {/* Balances Section */}
          <Box sx={{ width: '45%' }}>
            <SectionWrapper title={t('pages.account.balances.title')}>
              {account.balances && (
                <Table
                  withPagination={false}
                  items={account.balances}
                  columns={[
                    {
                      key: 'balance.asset',
                      label: t('pages.account.table.columnLabel.balance.asset'),
                    },
                    {
                      key: 'balance.value',
                      label: t('pages.account.table.columnLabel.balance.value'),
                    },
                  ]}
                  renderItem={(balance: Balance, index) => (
                    <Row
                      key={index}
                      keys={[
                        'asset',
                        () =>
                          renderValue(balance.value, palette.default.normal),
                      ]}
                      item={balance}
                    />
                  )}
                />
              )}
            </SectionWrapper>
          </Box>
          {/* Volumes Section */}
          <Box sx={{ width: '55%' }} pl={1}>
            <SectionWrapper title={t('pages.account.volumes.title')}>
              {account.volumes && (
                <Table
                  withPagination={false}
                  items={account.volumes}
                  columns={[
                    {
                      key: 'volume.asset',
                      label: t('pages.account.table.columnLabel.volume.asset'),
                    },
                    {
                      key: 'volume.received',
                      label: t(
                        'pages.account.table.columnLabel.volume.received'
                      ),
                    },
                    {
                      key: 'volume.sent',
                      label: t('pages.account.table.columnLabel.volume.sent'),
                    },
                  ]}
                  renderItem={(volume: Volume, index) => (
                    <Row
                      key={index}
                      keys={[
                        'asset',
                        () => renderValue(volume.received, palette.blue.darker),
                        () => renderValue(volume.sent, palette.red.darker),
                      ]}
                      item={volume}
                    />
                  )}
                />
              )}
            </SectionWrapper>
          </Box>
        </Box>
        {/* Transactions Section */}
        <SectionWrapper title={t('pages.account.transactions.title')}>
          <>
            {loaderData.transactions && (
              <TransactionList
                withPagination={false}
                transactions={
                  loaderData.transactions as unknown as Cursor<Transaction>
                }
                showMore
              />
            )}
          </>
        </SectionWrapper>
        {/* Metadata Section */}
        {id && (
          <Metadata
            sync={sync}
            metadata={account.metadata}
            title={t('pages.account.metadata.title')}
            resource={LedgerResources.ACCOUNTS}
            id={id}
          />
        )}
      </>
    </Page>
  );
}
