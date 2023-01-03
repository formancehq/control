import * as React from 'react';

import {
  AccountBalance,
  Done,
  FormatListBulleted,
  HourglassTop,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  Chip,
  ColorVariants,
  Date,
  LoadingButton,
  ObjectOf,
  Page,
  Row,
  SectionWrapper,
  StatsCard,
  Txid,
} from '@numaryhq/storybook';

import { getRoute, LEDGERS_LOGS_ROUTE } from '~/src/components/Navbar/routes';
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
import { QueryContexts, sanitizeQuery } from '~/src/utils/search';

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
    // TODO get only 5 first logs (use size params)
    const query = sanitizeQuery(request, QueryContexts.PARAMS);
    const url = `/ledger/${params.ledgerId}/log?${query}`;
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

  const renderTextInfo = (key: string, label: string, color: ColorVariants) => (
    <Grid container sx={{ marginBottom: 2 }}>
      <Grid item xs={2}>
        <Typography variant="bold">
          {t(`pages.ledger.sections.info.${key}`)}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Chip variant="square" label={label} color={color} />
      </Grid>
    </Grid>
  );

  return (
    <Page id="ledger" title={id}>
      <>
        {/* Stats section*/}
        <SectionWrapper title={t('pages.ledger.sections.stats.title')}>
          <Grid container>
            <Grid item xs={4}>
              {/* Card */}
              <StatsCard
                icon={<AccountBalance />}
                variant="blue"
                title1={t('pages.overview.stats.transactions')}
                title2={t('pages.overview.stats.accounts')}
                chipValue={id}
                value1={`${ledger.stats.transactions}`}
                value2={`${ledger.stats.accounts}`}
              />
            </Grid>
            {/* Ledger global info */}
            <Grid item xs={6}>
              {renderTextInfo('version', ledger.info.version, 'green')}
              {renderTextInfo('server', ledger.info.server, 'violet')}
              {renderTextInfo(
                'storage',
                ledger.info.config.storage.driver,
                'brown'
              )}
            </Grid>
          </Grid>
        </SectionWrapper>
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
            items={buildCursor(ledger.details.storage.migration)} // TODO use migrations once backend fix typo
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
