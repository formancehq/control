import * as React from 'react';

import { Wallet as WalletIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import {
  Chip,
  CopyPasteTooltip,
  Date,
  JsonViewer,
  Page,
  Row,
  SectionWrapper,
} from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import Table from '~/src/components/Wrappers/Table';
import { Cursor } from '~/src/types/generic';
import { Transaction } from '~/src/types/ledger';
import {
  Wallet,
  WalletBalance,
  WalletDetailedBalance,
  WalletHold,
} from '~/src/types/wallet';
import { API_WALLET } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

type WalletDetailsData = {
  wallet: Wallet;
  balances: WalletDetailedBalance[];
  holds: WalletHold[];
  transactions: Cursor<Transaction>;
};

export const meta: MetaFunction = () => ({
  title: 'Wallet',
  description: 'Show a wallet',
});

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.walletId, 'Expected params.walletId');
    const api = await createApiClient(session);

    const p = {
      wallet: api.getResource<Wallet>(
        `${API_WALLET}/wallets/${params.walletId}`,
        'data'
      ),
      holds: api.getResource<WalletHold[]>(
        `${API_WALLET}/holds/?walletID=${params.walletId}`,
        'cursor.data'
      ),
      transactions: api.getResource<Cursor<Transaction>>(
        `${API_WALLET}/transactions?walletID=${params.walletId}`,
        'cursor'
      ),
      rawBalances: await api.getResource<WalletBalance[]>(
        `${API_WALLET}/wallets/${params.walletId}/balances`,
        'cursor.data'
      ),
    };

    const wallet = await p.wallet;
    const holds = await p.holds;
    const transactions = await p.transactions;
    const rawBalances = await p.rawBalances;

    if (wallet && rawBalances && transactions && holds) {
      const balances = [];
      const p: {
        [key: string]: any;
      } = {};

      for (const balance of rawBalances) {
        p[balance.name] = api.getResource<WalletDetailedBalance>(
          `${API_WALLET}/wallets/${params.walletId}/balances/${balance.name}`,
          'data'
        );
      }

      for (const balance of rawBalances) {
        const detailedBalance = await api.getResource<WalletDetailedBalance>(
          `${API_WALLET}/wallets/${params.walletId}/balances/${balance.name}`,
          'data'
        );
        if (detailedBalance) {
          let a = '';
          Object.keys(detailedBalance.assets).forEach((key: string) => {
            a = `${a}${key} ${detailedBalance.assets[key]} `;
          });

          balances.push({ ...detailedBalance, formattedAssets: a });
        }
      }

      return {
        wallet,
        balances: balances.sort((a, b) => {
          // balance named 'main' should be first
          if (a.name === 'main') {
            return -1;
          } else {
            return 0;
          }
        }),
        holds,
        transactions: {
          ...transactions,
          data: transactions.data.map((transaction) => ({
            ...transaction,
            ledger: 'wallets-002', // TODO remove hardcoded ledger when NUM 1427 is done
          })),
        },
      };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="wallet"
      title="pages.wallet.title"
      error={error}
      showAction={false}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const data =
    useLoaderData<WalletDetailsData>() as unknown as WalletDetailsData;

  return (
    <Page
      id="wallet"
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              width: 32,
              height: 32,
              mr: 2,
              backgroundColor: (theme) => theme.palette.neutral[100],
              borderRadius: 1,
            }}
          >
            <WalletIcon
              sx={{
                opacity: 0.4,
              }}
              fontSize="small"
            />
          </Box>
          <Typography variant="h1" pr={1}>
            {t('pages.wallet.title')}
          </Typography>
        </Box>
      }
    >
      <>
        <SectionWrapper title={t('pages.wallet.sections.details.title')}>
          <Table
            withHeader={false}
            withPagination={false}
            items={[
              {
                key: t('pages.wallet.sections.details.walletId'),
                value: data.wallet.id,
              },
              {
                key: t('pages.wallet.sections.details.walletName'),
                value: data.wallet.name || (
                  <Typography color="textSecondary">
                    {t('pages.wallet.sections.details.noName')}
                  </Typography>
                ),
              },
              {
                key: t('pages.wallet.sections.details.createdAt'),
                value: data.wallet.createdAt,
              },
            ]}
            columns={[
              {
                key: 'key',
                label: '',
                width: 30,
              },
              {
                key: 'value',
                label: '',
                width: 30,
              },
            ]}
            renderItem={(item: { key: string; value: any }) => (
              <Row keys={['key', 'value']} item={item} />
            )}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.balances.title')}>
          {/* TODO adjust table with data from balances */}
          <Table
            withHeader={false}
            withPagination={false}
            items={data.balances}
            action
            columns={[
              {
                key: 'name',
                label: '',
                width: 30,
              },
              {
                key: 'type',
                label: '',
                width: 30,
              },
              {
                key: 'assets',
                label: '',
                width: 60,
              },
            ]}
            renderItem={(
              balance: WalletDetailedBalance & { formattedAssets: string }, // TODO temporary
              index
            ) => (
              <Row
                key={index}
                keys={[
                  <Chip
                    label={balance.name}
                    key={index}
                    variant="square"
                    color="blue"
                  />,
                  <Chip
                    key={index}
                    variant="square"
                    label={balance.name === 'main' ? 'primary' : 'secondary'}
                    color={balance.name === 'main' ? 'green' : undefined}
                  />,
                  'formattedAssets',
                ]}
                item={balance}
              />
            )}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.holds.title')}>
          <Table
            items={data.holds}
            withPagination={false}
            action
            columns={[
              {
                key: 'id',
                label: t('pages.wallet.sections.holds.table.columnLabel.id'),
                width: 40,
              },
              {
                key: 'asset',
                label: t('pages.wallet.sections.holds.table.columnLabel.asset'),
                width: 40,
              },
              {
                key: 'destination',
                label: t(
                  'pages.wallet.sections.holds.table.columnLabel.destination'
                ),
                width: 40,
              },
              {
                key: 'createdAt',
                label: t(
                  'pages.wallet.sections.holds.table.columnLabel.createdAt'
                ),
                width: 40,
              },
            ]}
            renderItem={(hold: WalletHold, index) => (
              <Row
                key={index}
                keys={[
                  <CopyPasteTooltip
                    key={index}
                    tooltipMessage={t('common.tooltip.copied')}
                    value={hold.id}
                  >
                    <Chip key={index} label={hold.id} variant="square" />
                  </CopyPasteTooltip>,
                  <Chip
                    key={index}
                    label={hold.asset}
                    variant="square"
                    color="blue"
                  />,
                  <Chip
                    key={index}
                    label={hold.destination.identifier}
                    variant="square"
                  />,
                  <Date key={index} timestamp={hold.createdAt} />,
                ]}
                item={hold}
              />
            )}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.transactions.title')}>
          <TransactionList
            withPagination={false}
            transactions={data.transactions as unknown as Cursor<Transaction>}
          />
        </SectionWrapper>
        <SectionWrapper title={t('pages.wallet.sections.metadata.title')}>
          <JsonViewer jsonData={data.wallet.metadata} />
        </SectionWrapper>
      </>
    </Page>
  );
}
