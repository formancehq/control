import * as React from 'react';

import {
  AccountBalance,
  Dns,
  Done,
  FormatListBulleted,
  HourglassTop,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  Chip,
  Date,
  LoadingButton,
  ObjectOf,
  Page,
  Row,
  SectionWrapper,
  StatsCard,
  Txid,
} from '@numaryhq/storybook';

import { getRoute, LEDGERS_LOGS_ROUTE } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import LedgerLogList from '~/src/components/Wrappers/Lists/LedgerLogList';
import Table from '~/src/components/Wrappers/Table';
import { Cursor } from '~/src/types/generic';
import {
  LedgerDetailedInfo,
  LedgerInfo,
  LedgerLog,
  LedgerMigration,
  LedgerMigrations,
  LedgerStats,
  Transaction,
} from '~/src/types/ledger';
import { API_LEDGER } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import {
  buildCursor,
  lowerCaseAllWordsExceptFirstLetter,
} from '~/src/utils/format';

type LedgerData = {
  stats: LedgerStats;
  details: LedgerDetailedInfo;
  info: LedgerInfo;
  logs: Cursor<LedgerLog<Transaction | ObjectOf<any>>>;
};

export const meta: MetaFunction = () => ({
  title: 'Ledger',
  description: 'Show a ledger',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="ledger"
      title="pages.ledger.title"
      error={error}
      showAction={false}
    />
  );
}

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.ledgerId, 'Expected params.ledgerId');
    const api = await createApiClient(session);
    const stats = await api.getResource<LedgerStats>(
      `${API_LEDGER}/${params.ledgerId}/stats`,
      'data'
    );
    const detailedInfo = await api.getResource<LedgerDetailedInfo>(
      `${API_LEDGER}/${params.ledgerId}/_info`,
      'data'
    );
    const info = await api.getResource<LedgerInfo>(
      `${API_LEDGER}/_info`,
      'data'
    );
    const url = `${API_LEDGER}/${params.ledgerId}/logs?pageSize=5`;
    const logs = await api.getResource<
      Cursor<LedgerLog<Transaction | ObjectOf<any>>>
    >(url, 'cursor');
    if (stats && detailedInfo && info && logs) {
      return { stats, details: detailedInfo, info, logs };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const ledger = useLoaderData<LedgerData>() as unknown as LedgerData;
  const { ledgerId: id } = useParams<{
    ledgerId: string;
  }>();
  const navigate = useNavigate();

  return (
    <Page id="ledger">
      <>
        {/* Info section*/}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          <StatsCard
            icon={<Dns />}
            variant="yellow"
            title1={t('pages.ledger.sections.info.server')}
            title2={t('pages.ledger.sections.info.storage')}
            chipValue={ledger.info.version}
            value1={ledger.info.server}
            value2={ledger.info.config.storage.driver}
          />
          <Box
            sx={{
              flexGrow: 2,
            }}
          >
            <StatsCard
              sx={{ width: 'calc(100% - 92px)', ml: 3 }}
              icon={<AccountBalance />}
              type="light"
              variant="blue"
              title1={t('pages.overview.stats.transactions')}
              title2={t('pages.overview.stats.accounts')}
              chipValue={id}
              value1={`${ledger.stats.transactions}`}
              value2={`${ledger.stats.accounts}`}
            />
          </Box>
        </Box>
        {/* Logs section */}
        <SectionWrapper
          title={t('pages.ledger.sections.logs.title')}
          element={
            <LoadingButton
              id="show-more-logs"
              onClick={() => navigate(getRoute(LEDGERS_LOGS_ROUTE, id))}
              startIcon={<FormatListBulleted />}
              variant="stroke"
              content={t('pages.ledger.sections.logs.showMore')}
            />
          }
        >
          <LedgerLogList logs={ledger.logs} withPagination={false} />
        </SectionWrapper>
        {/* Data migrations section*/}
        <SectionWrapper title={t('pages.ledger.sections.migrations.title')}>
          <Table
            id="ledger-migration-list"
            items={buildCursor(ledger.details.storage.migrations)}
            action={true}
            withPagination={false}
            columns={[
              {
                key: 'version',
                label: t(
                  'pages.ledger.sections.migrations.table.columnLabel.version'
                ),
              },
              {
                key: 'name',
                label: t(
                  'pages.ledger.sections.migrations.table.columnLabel.name'
                ),
              },
              {
                key: 'state',
                label: t(
                  'pages.ledger.sections.migrations.table.columnLabel.state'
                ),
              },
              {
                key: 'date',
                label: t(
                  'pages.ledger.sections.migrations.table.columnLabel.date'
                ),
              },
            ]}
            renderItem={(migration: LedgerMigration, index: number) => (
              <Row
                key={index}
                keys={[
                  <Txid key={index} id={migration.version} />,
                  'name',
                  <Chip
                    key={index}
                    variant="square"
                    icon={
                      migration.state === LedgerMigrations.DONE ? (
                        <Done />
                      ) : (
                        <HourglassTop />
                      )
                    }
                    label={lowerCaseAllWordsExceptFirstLetter(migration.state)}
                    color={
                      migration.state === LedgerMigrations.DONE
                        ? 'green'
                        : 'blue'
                    }
                  />,
                  <Date key={index} timestamp={migration.date} />,
                ]}
                item={migration}
              />
            )}
          />
        </SectionWrapper>
      </>
    </Page>
  );
}
