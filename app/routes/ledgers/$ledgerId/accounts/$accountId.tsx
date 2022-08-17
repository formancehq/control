import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Page, Row, SectionWrapper } from '@numaryhq/storybook';
import { Box, Typography } from '@mui/material';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import {
  Account,
  AccountHybrid,
  Balance,
  LedgerResources,
  Metadata as MetadataType,
  Volume,
} from '~/src/types/ledger';
import { useFetcher, useLoaderData } from '@remix-run/react';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCurrentLedger } from '~/src/utils/localStorage';
import Metadata from '~/src/components/Wrappers/Metadata';
import { prettyJson } from '~/src/components/Wrappers/Metadata/service';
import { getLedgerAccountDetailsRoute } from '~/src/components/Navbar/routes';
import Table from '~/src/components/Wrappers/Table';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';

export const normalizeBalance = (account: Account): AccountHybrid => {
  if (account) {
    return {
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
      metadata: [{ value: prettyJson(account.metadata as JSON) }],
    };
  }

  return {} as AccountHybrid;
};

export const meta: MetaFunction = () => ({
  title: 'Account details for an account',
  description: 'Display account details',
});

export function ErrorBoundary({ error }) {
  return (
    <ComponentErrorBoundary
      id="account"
      title="pages.ledgers.accounts.details.title"
      error={error}
    />
  );
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<AccountHybrid | null> => {
  invariant(params.ledgerId, 'Expected params.ledgerId');
  invariant(params.accountId, 'Expected params.accountId');
  const account = await new ApiClient().getResource<Account>(
    `${API_LEDGER}/${params.ledgerId}/${LedgerResources.ACCOUNTS}/${params.accountId}`,
    'data'
  );

  if (account) {
    return normalizeBalance(account);
  }

  return null;
};

export default function Index() {
  const loaderData = useLoaderData<AccountHybrid>();
  const { accountId: id } = useParams<{ accountId: string }>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const account = fetcher.data || loaderData;

  const sync = () => {
    fetcher.load(getLedgerAccountDetailsRoute(id!, getCurrentLedger()!));
  };

  const renderValue = (
    value: number,
    color: 'error' | 'primary' | 'default' = 'default'
  ) => <Typography color={color}>{value}</Typography>;

  return (
    <Page id="account" title={t('pages.ledgers.accounts.details.title')}>
      <>
        <Box display="flex" justifyContent="space-between" mb={3}>
          {/* Balances Section */}
          <Box sx={{ width: '45%' }}>
            <SectionWrapper
              title={t('pages.ledgers.accounts.details.balances.title')}
            >
              {account.balances && (
                <Table
                  withPagination={false}
                  items={account.balances}
                  columns={[
                    {
                      key: 'balance.asset',
                      label: t(
                        'pages.ledgers.accounts.details.table.columnLabel.balance.asset'
                      ),
                    },
                    {
                      key: 'balance.value',
                      label: t(
                        'pages.ledgers.accounts.details.table.columnLabel.balance.value'
                      ),
                    },
                  ]}
                  renderItem={(balance: Balance, index) => (
                    <Row
                      key={index}
                      keys={['asset', () => renderValue(balance.value)]}
                      item={balance}
                    />
                  )}
                />
              )}
            </SectionWrapper>
          </Box>
          {/* Volumes Section */}
          <Box sx={{ width: '55%' }} pl={1}>
            <SectionWrapper
              title={t('pages.ledgers.accounts.details.volumes.title')}
            >
              {account.volumes && (
                <Table
                  withPagination={false}
                  items={account.volumes}
                  columns={[
                    {
                      key: 'volume.asset',
                      label: t(
                        'pages.ledgers.accounts.details.table.columnLabel.volume.asset'
                      ),
                    },
                    {
                      key: 'volume.received',
                      label: t(
                        'pages.ledgers.accounts.details.table.columnLabel.volume.received'
                      ),
                    },
                    {
                      key: 'volume.sent',
                      label: t(
                        'pages.ledgers.accounts.details.table.columnLabel.volume.sent'
                      ),
                    },
                  ]}
                  renderItem={(volume: Volume, index) => (
                    <Row
                      key={index}
                      keys={[
                        'asset',
                        () => renderValue(volume.received, 'primary'),
                        () => renderValue(volume.sent, 'error'),
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
        <SectionWrapper
          title={t('pages.ledgers.accounts.details.transactions.title')}
        >
          <>
            <TransactionList
              currentLedger={getCurrentLedger()!}
              account={id}
              withPagination={false}
              paginationSize={5}
            />
          </>
        </SectionWrapper>
        {/* Metadata Section */}
        {id && (
          <Metadata
            sync={sync}
            metadata={account.metadata as MetadataType[]}
            title={t('pages.ledgers.accounts.details.metadata.title')}
            resource={LedgerResources.ACCOUNTS}
            id={id}
          />
        )}
      </>
    </Page>
  );
}
