import * as React from 'react';
import type { MetaFunction } from 'remix';
import { Page, SectionWrapper } from '@numaryhq/storybook';
import { Box, Typography } from '@mui/material';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import {
  Account,
  AccountHybrid,
  Asset,
  Balance,
  LedgerResources,
  Volume,
} from '~/src/types/ledger';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { head } from 'lodash';
import { useLoaderData } from '@remix-run/react';
import Table from '../../../../src/components/Table';
import Row from '~/src/components/Table/components/Row';
import TransactionList from '~/src/components/Lists/TransactionList';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCurrentLedger } from '~/src/utils/localStorage';
import Metadata from '~/src/components/Metadata';

export const normalizeBalance = (
  account: Account,
  asset: Asset[]
): AccountHybrid => {
  if (account && asset) {
    return {
      balances: asset.map((item: Asset) => ({
        asset: item.name,
        value: item.input - item.output,
      })) as Balance[],

      volumes: asset.map((item) => ({
        asset: item.name,
        received: item.input,
        sent: item.output,
      })) as Volume[],
      metadata: [{ value: account.metadata }],
    };
  }

  return {} as AccountHybrid;
};

export const meta: MetaFunction = () => ({
  title: 'Account details for an account',
  description: 'Display account details',
});

export const loader: LoaderFunction = async ({
  params,
}): Promise<AccountHybrid | undefined> => {
  invariant(params.ledgerId, 'Expected params.ledgerId');
  invariant(params.accountId, 'Expected params.accountId');
  const api = new ApiClient();

  const account = head(
    await api.postResource<Account[]>(
      API_SEARCH,
      {
        target: SearchTargets.ACCOUNT,
        policy: SearchPolicies.OR,
        terms: [`address=${params.accountId}`],
      },
      'cursor.data'
    )
  );
  const assets = await api.postResource<Asset[]>(
    API_SEARCH,
    {
      target: SearchTargets.ASSET,
      policy: SearchPolicies.OR,
      terms: [`account=${params.accountId}`],
    },
    'cursor.data'
  );

  if (account && assets) {
    return normalizeBalance(account, assets);
  }
};

export default function Index() {
  const account = useLoaderData<AccountHybrid>();
  const { accountId: id } = useParams<{ accountId: string }>();
  const { t } = useTranslation();

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
                  key="accounts-balance"
                  items={account.balances}
                  columns={[{ key: 'balance.asset' }, { key: 'balance.value' }]}
                  resource="ledgers.accounts.details"
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
                  key={`${id}-volume`}
                  items={account.volumes}
                  columns={[
                    { key: 'volume.asset' },
                    { key: 'volume.received' },
                    { key: 'volume.sent' },
                  ]}
                  resource={'ledgers.accounts.details'}
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
              showMore
            />
          </>
        </SectionWrapper>
        {/* Metadata Section */}
        {id && (
          <Metadata
            metadata={account.metadata}
            title={t('pages.ledgers.accounts.details.metadata.title')}
            resource={LedgerResources.ACCOUNTS}
            id={id}
          />
        )}
      </>
    </Page>
  );
}
