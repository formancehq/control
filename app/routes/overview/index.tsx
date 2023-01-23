import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import { AccountBalance, NorthEast, Person } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Link, Typography } from '@mui/material';
import type { LoaderFunction, MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  scales,
  PointElement,
  LineElement,
} from 'chart.js';
import { get, take } from 'lodash';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  animated,
  useTransition as useAnimationTransition,
} from 'react-spring';

import {
  ActionCard,
  LoadingButton,
  Page,
  StatsCard,
  TitleWithBar,
} from '@numaryhq/storybook';

import { CONNECTORS_ROUTE, overview } from '~/src/components/Layout/routes';
import { useOpen } from '~/src/hooks/useOpen';
import { useService } from '~/src/hooks/useService';
import { Cursor } from '~/src/types/generic';
import { Account, LedgerInfo, LedgerStats } from '~/src/types/ledger';
import { Payment } from '~/src/types/payment';
import { SearchTargets } from '~/src/types/search';
import { ChartData, toBarChart } from '~/src/utils/aggregations/aggregations';
import { ledgerTransactions } from '~/src/utils/aggregations/ledgerTransactions';
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export const meta: MetaFunction = () => ({
  title: 'Overview',
  description: 'Show a dashboard with tasks and status',
});

export function ErrorBoundary() {
  return <Overview />;
}

type Ledger = { slug: string; stats: number; color: string };

type OverviewData = {
  accounts: Cursor<Account> | undefined;
  payments: Cursor<Payment> | undefined;
  ledgers: string[] | [];
  chart?: ChartData;
};

const colors = ['brown', 'red', 'yellow', 'default', 'violet', 'green', 'blue'];

const getData = async (ledgersList: string[], api: ApiClient) => {
  const ledgers = [] as any;
  const firstThreeLedgers = take(ledgersList, 3);
  for (const ledger of firstThreeLedgers) {
    const stats = await api.getResource<LedgerStats>(
      `${API_LEDGER}/${ledger}/stats`,
      'data'
    );
    ledgers.push({
      slug: ledger,
      stats,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return ledgers;
};

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(session);
    const local = await createApiClient(session, 'http://localhost:8080');
    const payments = await api.postResource<Cursor<Payment>>(
      '/search',
      {
        target: SearchTargets.PAYMENT,
        size: 1,
      },
      'cursor'
    );

    const accounts = await api.postResource<Cursor<Account>>(
      '/search',
      {
        target: SearchTargets.ACCOUNT,
        size: 1,
      },
      'cursor'
    );

    const ledgersList = await api.getResource<LedgerInfo>(
      `/ledger/_info`,
      'data.config.storage.ledgers'
    );

    const res: any = await api.postResource('/search', {
      raw: ledgerTransactions(),
    });

    const data = res.aggregations['history'];
    console.log(data);

    const chart = toBarChart(data);

    return {
      accounts: accounts,
      payments: payments,
      ledgers: ledgersList,
      chart,
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
  const [stats, setStats] = useState<Ledger[]>([]);
  const { currentUser } = useService();
  const { api } = useService();
  // TODO check if the back send us back a serialized value so we don't have to use get anymore
  const accounts = get(data, 'accounts.total.value', 0) as number;
  const payments = get(data, 'payments.total.value', 0) as number;
  const ledgers = get(data, 'ledgers', []);
  const shouldDisplaySetup = payments === 0 || accounts === 0;
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, _load, stopLoading] = useOpen(true);
  const loadingTransition = useAnimationTransition(ledgers.length, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  useEffect(() => {
    (async () => {
      const results = await getData(ledgers, api);
      if (results) {
        setStats(results);
      }
      stopLoading();
    })();
  }, []);

  return (
    <>
      <Page id={overview.id}>
        <>
          <Typography variant="h1" sx={{ mb: 4 }}>
            <span>Overview</span>
          </Typography>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box
              sx={{
                borderRadius: '6px',
                border: '1px solid rgb(239, 241, 246)',
                height: '300px',
                flex: 1,
                p: 2,
              }}
            >
              <Bar
                options={{
                  font: {
                    family: 'Roboto Mono',
                  },
                  plugins: {
                    tooltip: {
                      // enabled: false,
                    },
                    legend: {
                      position: 'bottom',
                      // should do nothing
                      onClick: () => {},
                      labels: {
                        useBorderRadius: true,
                        borderRadius: 4,
                      },
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                      grid: {
                        color: 'rgb(239, 241, 246)',
                      },
                    },
                    y: {
                      stacked: true,
                      grid: {
                        color: 'rgb(239, 241, 246)',
                      },
                    },
                  },
                }}
                data={{
                  labels: data?.chart?.labels,
                  datasets: data?.chart?.datasets as any,
                }}
              />
            </Box>
            {/* <Box sx={{
              borderRadius: '6px',
              border: '1px solid rgb(239, 241, 246)',
              height: '300px',
              flex: 1,
              p: 2,
            }}>
              <Line
                options={{

                }}
                data={{
                  labels: [
                    '6:00pm',
                    '5:00pm',
                    '4:00pm',
                    '3:00pm',
                    '2:00pm',
                    '1:00pm',
                  ],
                  datasets: [
                    {
                      label: 'main-ledger',
                      data: [
                        124,
                        1101,
                        327,
                        532,
                        123,
                        981,
                      ],
                    },
                    {
                      label: 'secondary-ledger',
                      data: [
                        124,
                        327,
                        532,
                        123,
                        981,
                        1622,
                      ],
                    },
                  ],
                }}/>
            </Box> */}
          </Box>
        </>
      </Page>
    </>
  );
};
