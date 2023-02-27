import * as React from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { Page, Row, SectionWrapper } from '@numaryhq/storybook';

import Line from '~/src/components/Dataviz/Charts/Line';
import { buildLineChartDataset } from '~/src/components/Dataviz/Charts/Line/utils';
import {
  buildChart,
  buildDateHistogramAggs,
  buildLabels,
  buildPayloadQuery,
  buildQueryPayloadMatchPhrase,
  buildQueryPayloadTerms,
} from '~/src/components/Dataviz/Charts/utils';
import {
  accounts,
  getLedgerAccountDetailsRoute,
} from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import Metadata from '~/src/components/Wrappers/Metadata';
import Table from '~/src/components/Wrappers/Table';
import { Chart } from '~/src/types/chart';
import { Cursor } from '~/src/types/generic';
import {
  Account,
  AccountHybrid,
  Balance,
  LedgerResources,
  Transaction,
  Volume,
} from '~/src/types/ledger';
import { Bucket, SearchPolicies, SearchTargets } from '~/src/types/search';
import { API_LEDGER, API_SEARCH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

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
  metadata: account.metadata,
});

export const meta: MetaFunction = () => ({
  title: 'Account',
  description: 'Show an account',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="account"
      title="pages.account.title"
      error={error}
      showAction={false}
    />
  );
}

export const loader: LoaderFunction = async ({ params, request }) => {
  async function handleData(session: Session) {
    invariant(params.ledgerId, 'Expected params.ledgerId');
    invariant(params.accountId, 'Expected params.accountId');
    const api = await createApiClient(session);
    const account = await api.getResource<Account>(
      `${API_LEDGER}/${params.ledgerId}/${LedgerResources.ACCOUNTS}/${params.accountId}`,
      'data'
    );
    const transactions = await api.postResource<Cursor<Transaction>>(
      API_SEARCH,
      {
        size: 5,
        policy: SearchPolicies.OR,
        terms: [
          `destination=${params.accountId}`,
          `source=${params.accountId}`,
        ],
        target: SearchTargets.TRANSACTION,
        ledgers: [params.ledgerId],
      },
      'cursor'
    );

    const chart = await api.postResource<Bucket[]>(
      API_SEARCH,
      {
        raw: buildPayloadQuery(
          'indexed.timestamp',
          buildDateHistogramAggs('indexed.timestamp'),
          SearchTargets.TRANSACTION,
          buildQueryPayloadMatchPhrase([
            { key: 'ledger', value: params.ledgerId },
          ]),
          buildQueryPayloadTerms([
            { key: 'indexed.source', value: [params.accountId] },
            { key: 'indexed.destination', value: [params.accountId] },
          ])
        ),
      },
      'aggregations.chart.buckets'
    );

    const dataset = buildLineChartDataset(chart!, params.ledgerId);

    return {
      account: account ? normalizeBalance(account) : undefined,
      transactions,
      chart: buildChart(buildLabels([dataset], 'LT'), [dataset]),
    };
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const loaderData = useLoaderData<{
    account: AccountHybrid;
    transactions: Cursor<Transaction>;
    chart: Chart;
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fetcher.load(getLedgerAccountDetailsRoute(id!, ledgerId!));
  };

  const renderValue = (value: number, color: string) => (
    <Typography sx={{ color }} variant="money">
      {value}
    </Typography>
  );

  return (
    <Page
      id="account"
      title={<IconTitlePage icon={accounts.icon} title={id!} />}
    >
      <>
        {/* Chart */}
        <Line
          data={loaderData.chart}
          title={t('pages.account.charts.transaction', {
            account: lowerCaseAllWordsExceptFirstLetter(id!),
          })}
        />
        <Box display="flex" gap="26px">
          {/* Balances Section */}
          <Box sx={{ width: '50%' }}>
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
                      width: 20,
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
          <Box sx={{ width: '50%' }}>
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
                      width: 20,
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
