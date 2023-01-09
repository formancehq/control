import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';

import { AccountBalance, NorthEast, Person } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Link, Typography } from '@mui/material';
import type { LoaderFunction, MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { get, take } from 'lodash';
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
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

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

    return {
      accounts: accounts,
      payments: payments,
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

            <Box
              mt={3}
              display="flex"
              flexWrap="wrap"
              data-testid="stats-card"
              justifyContent="flex-start"
              gap="26px"
            >
              {loading && (
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
              )}

              {/* TODO Add Transition Between loading state and empty/not empty state */}
              {loadingTransition((props, ledgersLength) =>
                ledgersLength > 0 ? (
                  stats.map((ledger: Ledger, index: number) => (
                    <animated.div key={index} style={props}>
                      <Box>
                        <StatsCard
                          key={index}
                          icon={<AccountBalance />}
                          variant={ledger.color as any}
                          title1={t('pages.overview.stats.transactions')}
                          title2={t('pages.overview.stats.accounts')}
                          chipValue={ledger.slug}
                          value1={`${get(ledger, 'stats.transactions', '0')}`}
                          value2={`${get(ledger, 'stats.accounts', '0')}`}
                        />
                      </Box>
                    </animated.div>
                  ))
                ) : (
                  <animated.div style={props}>
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
                  </animated.div>
                )
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
