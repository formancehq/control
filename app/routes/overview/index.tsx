import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import { AccountBalance, NorthEast, Person } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import type { LoaderFunction, MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ActionCard,
  LoadingButton,
  Page,
  StatsCard,
  TitleWithBar,
} from '@numaryhq/storybook';

import Line from '~/src/components/Dataviz/Charts/Line';
import {
  buildLineChart,
  buildLineChartDataset,
  buildLineLabels,
} from '~/src/components/Dataviz/Charts/Line/utils';
import {
  buildPayloadQuery,
  buildQueryPayloadMatchPhrase,
} from '~/src/components/Dataviz/Charts/utils';
import { CONNECTORS_ROUTE, overview } from '~/src/components/Layout/routes';
import { useOpen } from '~/src/hooks/useOpen';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';
import { Chart } from '~/src/types/chart';
import { Cursor } from '~/src/types/generic';
import { Account, LedgerInfo } from '~/src/types/ledger';
import { Payment } from '~/src/types/payment';
import { Bucket, SearchTargets } from '~/src/types/search';
import { API_LEDGER, API_SEARCH, ApiClient } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Overview',
  description: 'Show a dashboard with tasks and status',
});

export function ErrorBoundary() {
  return <Overview />;
}

const getTransactionLedgerChartData = async (
  ledgersList: string[],
  api: ApiClient
) => {
  const datasets = [];
  for (const ledger of ledgersList) {
    const chart = await api.postResource<Bucket[]>(
      API_SEARCH,
      {
        raw: buildPayloadQuery(
          'indexed.timestamp',
          SearchTargets.TRANSACTION,
          buildQueryPayloadMatchPhrase([{ key: 'ledger', value: ledger }])
        ),
      },
      'aggregations.line.buckets'
    );
    if (chart) {
      datasets.push(buildLineChartDataset(chart, ledger));
    }
  }

  return buildLineChart(buildLineLabels(datasets), datasets);
};

const getPaymentChartData = async (api: ApiClient) => {
  const chart = await api.postResource<Bucket[]>(
    API_SEARCH,
    {
      raw: buildPayloadQuery(
        'indexed.createdAt',
        SearchTargets.PAYMENT,
        undefined,
        undefined,
        undefined,
        '1d'
      ),
    },
    'aggregations.line.buckets'
  );

  if (chart) {
    const dataset = buildLineChartDataset(chart, i18n.t('pages.payment.title'));

    return buildLineChart(buildLineLabels([dataset]), [dataset]);
  }
};

type OverviewData = {
  accounts?: Cursor<Account>;
  payments?: Cursor<Payment>;
  charts: Chart;
};

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(session);
    const payments = await api.postResource<Cursor<Payment>>(
      API_SEARCH,
      {
        target: SearchTargets.PAYMENT,
        size: 1,
      },
      'cursor'
    );
    const accounts = await api.postResource<Cursor<Account>>(
      API_SEARCH,
      {
        target: SearchTargets.ACCOUNT,
        size: 1,
      },
      'cursor'
    );
    const ledgersList = await api.getResource<LedgerInfo>(
      `${API_LEDGER}/_info`,
      'data.config.storage.ledgers'
    );

    return {
      accounts,
      payments,
      ledgers: ledgersList,
    };
  }

  return await handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const data = useLoaderData<OverviewData>() as OverviewData;

  return <Overview data={data} />;
}

const Overview: FunctionComponent<{ data?: OverviewData }> = ({ data }) => {
  const { t } = useTranslation();
  const [charts, setCharts] = useState<{
    transaction: Chart;
    payment: Chart;
  }>({
    transaction: {
      labels: [],
      datasets: [],
    },
    payment: { labels: [], datasets: [] },
  });
  const { currentUser } = useService();
  const { api } = useService();
  const accounts = get(data, 'accounts.total.value', 0) as number;
  const payments = get(data, 'payments.total.value', 0) as number;
  const ledgers = get(data, 'ledgers', []);
  const shouldDisplaySetup = payments === 0 || accounts === 0;
  const navigate = useNavigate();
  const [loading, _load, stopLoading] = useOpen(true);

  useEffect(() => {
    (async () => {
      const transactionChart = await getTransactionLedgerChartData(
        ledgers,
        api
      );
      const paymentChart = await getPaymentChartData(api);
      if (transactionChart && paymentChart) {
        setCharts({ payment: paymentChart, transaction: transactionChart });
      }

      stopLoading();
    })();
  }, []);

  return (
    <>
      <Page id={overview.id}>
        <>
          {currentUser && currentUser.pseudo && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    backgroundColor: ({ palette }) => palette.neutral[800],
                    width: 52,
                    height: 52,
                    borderRadius: '4px',
                  }}
                >
                  <Person fontSize="large" />
                </Avatar>
                <Box display="flex-column" p={2} alignItems="center">
                  <Typography variant="headline">
                    {`${t('pages.overview.hello')} ${currentUser.pseudo} 👋`}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: ({ palette }) => palette.neutral[400] }}
                  >
                    {t('pages.overview.subtitle')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          {/*  STATUS */}
          <Box mt={5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                '& .MuiBox-root': {
                  marginBottom: '0px',
                },
              }}
            >
              <TitleWithBar title={t('pages.overview.status')} />
            </Box>
            {/* No data*/}
            {ledgers.length === 0 && (
              <Box
                mr={3}
                onClick={() => navigate(CONNECTORS_ROUTE)}
                sx={{
                  ':hover': {
                    opacity: 0.3,
                    cursor: 'pointer',
                  },
                }}
              >
                <StatsCard
                  icon={<AccountBalance />}
                  variant="violet"
                  title1={t('pages.overview.stats.transactions')}
                  title2={t('pages.overview.stats.accounts')}
                  chipValue="get-started"
                  value1="0"
                  value2="0"
                />
              </Box>
            )}

            {/* CHARTS */}
            <Box mt={3}>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '276px',
                  }}
                >
                  <CircularProgress size={30} color="secondary" />
                </Box>
              ) : (
                <Grid container>
                  <Grid item xs={6}>
                    <Line data={charts.payment} />
                  </Grid>
                  <Grid item xs={6}>
                    <Line data={charts.transaction} />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </>
      </Page>
      {/* TASKS */}
      <Page
        title={<TitleWithBar title={t('pages.overview.tasks.title')} />}
        id="tasks"
      >
        <Box
          mt="26px"
          display="flex"
          flexWrap="wrap"
          data-testid="tasks"
          justifyContent="flex-start"
          gap="26px"
        >
          <ActionCard
            title={t('pages.overview.tasks.tuto.title')}
            description={t('pages.overview.tasks.tuto.description')}
            width="400px"
          >
            <Link
              id="tasks-tuto"
              href="https://docs.formance.com/oss/ledger/get-started/hello-world"
              underline="none"
              target="_blank"
              rel="noopener"
            >
              <LoadingButton
                id="task-tuto-button"
                variant="dark"
                content={t('pages.overview.tasks.tuto.buttonText')}
                sx={{ mt: '12px' }}
                startIcon={<NorthEast />}
              />
            </Link>
          </ActionCard>
          <ActionCard
            title={t('pages.overview.tasks.useCaseLib.title')}
            description={t('pages.overview.tasks.useCaseLib.description')}
            width="400px"
          >
            <Link
              href="https://www.formance.com/use-cases-library"
              underline="none"
              target="_blank"
              rel="noopener"
            >
              <LoadingButton
                id="task-use-case-libButton"
                variant="dark"
                content={t('pages.overview.tasks.useCaseLib.buttonText')}
                sx={{ mt: '12px' }}
                startIcon={<NorthEast />}
              />
            </Link>
          </ActionCard>
        </Box>
      </Page>

      {/* SET-UP */}
      {shouldDisplaySetup && (
        <Page
          title={
            <TitleWithBar title={t('pages.overview.setUp.sectionTitle')} />
          }
          id="setup"
        >
          <Box
            mt="26px"
            display="flex"
            flexWrap="wrap"
            data-testid="set-up"
            justifyContent="flex-start"
            gap="26px"
          >
            {payments === 0 && (
              <ActionCard
                title={t('pages.overview.setUp.connexion.title')}
                description={t('pages.overview.setUp.connexion.description')}
                width="400px"
              >
                <Link
                  id="setup-payments"
                  href="https://docs.formance.com/oss/payments/reference/api"
                  underline="none"
                  target="_blank"
                  rel="noopener"
                >
                  <LoadingButton
                    id="setup-payments-button"
                    variant="dark"
                    content={t('pages.overview.setUp.connexion.buttonText')}
                    sx={{ mt: '12px' }}
                    startIcon={<NorthEast />}
                  />
                </Link>
              </ActionCard>
            )}
            {accounts === 0 && (
              <ActionCard
                title={t('pages.overview.setUp.ledger.title')}
                description={t('pages.overview.setUp.ledger.description')}
                width="400px"
              >
                <Link
                  id="setup-ledger"
                  href="https://docs.formance.com/oss/ledger/reference/api"
                  underline="none"
                  target="_blank"
                  rel="noopener"
                >
                  <LoadingButton
                    id="setup-ledger-button"
                    variant="dark"
                    content={t('pages.overview.setUp.ledger.buttonText')}
                    sx={{ mt: '12px' }}
                    startIcon={<NorthEast />}
                  />
                </Link>
              </ActionCard>
            )}
          </Box>
        </Page>
      )}
    </>
  );
};

// c02b029c14982de103e768ed85351ce592773048;
