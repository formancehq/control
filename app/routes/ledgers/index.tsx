import * as React from 'react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import {
  EmptyState,
  Page,
  SelectButton,
  SelectButtonItem,
  TabButton,
} from '@numaryhq/storybook';
import { Box } from '@mui/material';
import { SearchTarget, SearchTargets } from '~/src/types/search';
import { useTranslation } from 'react-i18next';
import AccountList from '~/src/components/Wrappers/Lists/AccountList/AccountList';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList/TransactionList';
import { LoaderFunction } from '@remix-run/server-runtime';
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import { LedgerInfo } from '~/src/types/ledger';
import { buildQuery } from '~/src/utils/search';
import { URLSearchParamsInit } from 'react-router-dom';
import { getCurrentLedger, setCurrentLedger } from '~/src/utils/localStorage';
import { ledgers as ledgersConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';

export const meta: MetaFunction = () => ({
  title: 'Ledger list',
  description: 'Display list of accounts and transaction for a ledger',
});

export const loader: LoaderFunction = async () => {
  const res = await new ApiClient().getResource<LedgerInfo>(
    `${API_LEDGER}/_info`,
    'data'
  );

  return res.config.storage.ledgers.map((ledger: string) => ({
    id: ledger,
    label: ledger,
  }));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={ledgersConfig.id}
      title="pages.ledgers.title"
      error={error}
    />
  );
}

export default function Index() {
  const [showAccounts, setShowAccounts] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const ledgers = useLoaderData();
  const currentLedger = getCurrentLedger();
  const emptyState = !showTransactions && !showAccounts && !currentLedger;

  useEffect(() => {
    if (currentLedger) {
      setShowAccounts(true);
      setShowTransactions(false);
      const query = {
        ...buildQuery(searchParams),
        ledgers: [currentLedger],
        target: SearchTargets.ACCOUNT,
      };
      const url = new URLSearchParams(query as any);
      if (url.toString() !== searchParams.toString()) {
        setSearchParams({
          ...buildQuery(searchParams),
          ledgers: [currentLedger],
          target: SearchTargets.ACCOUNT,
        } as URLSearchParamsInit);
      }
    }
  }, []);
  const handleLedger = (item: SelectButtonItem | undefined) => {
    if (item) {
      setCurrentLedger(item.label);
      setShowAccounts(true);
      setShowTransactions(false);
      setSearchParams({
        ...buildQuery(searchParams),
        ledgers: [item.label],
        target: SearchTargets.ACCOUNT,
      } as URLSearchParamsInit);
    }
  };

  const handleTab = (searchTarget: string) => {
    setSearchParams({
      ...buildQuery(searchParams),
      target: searchTarget,
      cursor: '',
    } as URLSearchParamsInit);
    if (searchTarget === SearchTargets.ACCOUNT) {
      setShowAccounts(true);
      setShowTransactions(false);
    } else {
      setShowAccounts(false);
      setShowTransactions(true);
    }
  };
  const renderTab = (
    label: string,
    searchTarget: SearchTarget
  ): React.ReactNode => {
    const stateMap = {
      [SearchTargets.TRANSACTION]: showTransactions,
      [SearchTargets.ACCOUNT]: showAccounts,
    };

    return (
      <TabButton
        type={searchTarget}
        map={stateMap}
        label={t(label)}
        onClick={() => handleTab(searchTarget)}
        active={searchParams.get('target') === searchTarget}
      />
    );
  };

  return (
    <Page id={ledgersConfig.id}>
      <>
        <Box
          display="flex"
          justifyContent={!emptyState ? 'space-between' : 'end'}
        >
          {!emptyState && (
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ width: '300px' }}
            >
              {renderTab('pages.ledgers.accounts.tab', SearchTargets.ACCOUNT)}
              {renderTab(
                'pages.ledgers.transactions.tab',
                SearchTargets.TRANSACTION
              )}
            </Box>
          )}
          <Box>
            <SelectButton
              label={getCurrentLedger() || t('pages.ledgers.select.label')}
              variant="dark"
              items={ledgers}
              onClick={(item) => handleLedger(item)}
              paperSx={{
                width: 262,
                '& ul': {
                  height: 'auto',
                },
              }}
              search={false}
              noResult={t('common.noResult')}
            />
          </Box>
        </Box>

        {emptyState && (
          <Box mt={3}>
            <EmptyState
              title={t('pages.ledgers.emptyState.title')}
              description={t('pages.ledgers.emptyState.description')}
            />
          </Box>
        )}

        {!emptyState && (
          <Box>
            {showAccounts && (
              <AccountList currentLedger={currentLedger as string} />
            )}
            {showTransactions && (
              <TransactionList
                currentLedger={currentLedger as string}
                withPagination
              />
            )}
          </Box>
        )}
      </>
    </Page>
  );
}
