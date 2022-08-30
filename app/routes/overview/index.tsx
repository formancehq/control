import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Box, Link } from '@mui/material';
import { overview } from '~/src/components/Navbar/routes';
import {
  LoadingButton,
  OnBoarding,
  Page,
  StatsCard,
  theme,
  TitleWithBar,
} from '@numaryhq/storybook';
import { AccountBalance, NorthEast } from '@mui/icons-material';
import { API_LEDGER, API_SEARCH, ApiClient } from '~/src/utils/api';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Cursor } from '~/src/types/generic';
import { Payment } from '~/src/types/payment';
import { SearchTargets } from '~/src/types/search';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { Account, LedgerInfo } from '~/src/types/ledger';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import { LedgerList } from '../ledgers/list';

export const meta: MetaFunction = () => ({
  title: 'Overview',
  description: 'Show a dashboard with tasks and status',
});

interface LoaderReturnValue {
  accounts: Cursor<Account> | undefined;
  payments: Cursor<Payment> | undefined;
  ledgers: { slug: string; stats: number; color: string }[] | [];
}

const colors = ['brown', 'red', 'yellow', 'default', 'violet', 'green', 'blue'];

export const loader: LoaderFunction = async () => {
  const api = new ApiClient();
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
    'data'
  );

  if (ledgersList) {
    const ledgers = ledgersList.config.storage.ledgers.map(
      async (ledger: string) => {
        const stats = await api.getResource<any>(
          `${API_LEDGER}/${ledger}/stats`,
          'data'
        );

        return {
          slug: ledger,
          stats,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      }
    );

    return Promise.all(ledgers).then((values) =>
      json({ accounts, payments, ledgers: values })
    );
  }

  return json({ accounts, payments, ledgers: [] });
};

export default function Index() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderReturnValue>() as LoaderReturnValue;

  // TODO check if the back send us back a serialized value so we don't have to use get anymore
  const accounts = get(data, 'accounts.total.value', 0) as number;
  const payments = get(data, 'payments.total.value', 0) as number;
  const shouldDisplaySetup = payments === 0 || accounts === 0;
  const [searchParams] = useSearchParams();
  const urlParamsLedgers = searchParams.getAll('ledgers');

  return (
    <>
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.neutral[900],
        }}
      >
        <Box
          sx={{
            borderTop: ({ palette }) => `1px solid ${palette.neutral[800]}`,
            borderBottom: ({ palette }) => `1px solid ${palette.neutral[800]}`,
          }}
        >
          <Page id={overview.id}>
            <>
              {/* TODO uncomment when current user is ready*/}
              {/*<Box*/}
              {/*  display="flex"*/}
              {/*  alignItems="center"*/}
              {/*  justifyContent="space-between"*/}
              {/*>*/}
              {/*  <Box display="flex">*/}
              {/*    <Avatar*/}
              {/*      sx={{*/}
              {/*        backgroundColor: ({ palette }) => palette.neutral[800],*/}
              {/*        width: 72,*/}
              {/*        height: 72,*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <Person fontSize="large" />*/}
              {/*    </Avatar>*/}
              {/*    <Box display="flex-column" p={2} alignItems="center">*/}
              {/*      <Typography*/}
              {/*        variant="headline"*/}
              {/*        sx={{ color: ({ palette }) => palette.neutral[0] }}*/}
              {/*      >*/}
              {/*        {`${t('pages.overview.hello')} 👋`}*/}
              {/*      </Typography>*/}
              {/*      <Typography*/}
              {/*        variant="body1"*/}
              {/*        sx={{ color: ({ palette }) => palette.neutral[400] }}*/}
              {/*      >*/}
              {/*        {t('pages.overview.subtitle')}*/}
              {/*      </Typography>*/}
              {/*    </Box>*/}
              {/*  </Box>*/}
              {/*  <Box>*/}
              {/*    <LoadingButton*/}
              {/*      startIcon={<GitHub />}*/}
              {/*      content={t('pages.overview.githubContent')}*/}
              {/*      sx={{ marginRight: 2 }}*/}
              {/*      onClick={() =>*/}
              {/*        window.open('https://github.com/numary/ledger')*/}
              {/*      }*/}
              {/*    />*/}
              {/*    <LoadingButton*/}
              {/*      startIcon={<ReadMore />}*/}
              {/*      variant="primary"*/}
              {/*      content={t('pages.overview.docsContent')}*/}
              {/*      onClick={() =>*/}
              {/*        window.open('https://docs.formance.com/oss/ledger')*/}
              {/*      }*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*</Box>*/}

              {/*  STATUS */}
              <Box mt={5}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    '& div': { marginBottom: '0px !important' },
                  }}
                >
                  <TitleWithBar
                    title={t('pages.overview.status')}
                    titleColor={theme.palette.neutral[0]}
                  />
                  {data.ledgers.length > 3 && (
                    <FiltersBar>
                      <LedgerList />
                    </FiltersBar>
                  )}
                </Box>

                <Box
                  mt={3}
                  display="flex"
                  flexWrap="wrap"
                  data-testid="stats-card"
                  justifyContent="flex-start"
                  gap="26px"
                >
                  {data.ledgers.length > 0 ? (
                    data.ledgers
                      .filter((currentLedger) =>
                        urlParamsLedgers.length === 0
                          ? true
                          : urlParamsLedgers.includes(currentLedger.slug)
                      )
                      .map((ledger, index) => (
                        <Box key={index}>
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
                      ))
                  ) : (
                    <Box mr={3}>
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
                </Box>
              </Box>
            </>
          </Page>
        </Box>
      </Box>

      {/* TASKS */}
      <Page
        title={<TitleWithBar title={t('pages.overview.tasks.title')} />}
        id="tasks"
      >
        <Box
          mt={3}
          display="flex"
          flexWrap="wrap"
          data-testid="tasks"
          justifyContent="flex-start"
          gap="26px"
        >
          <OnBoarding
            title={t('pages.overview.tasks.tuto.title')}
            description={t('pages.overview.tasks.tuto.description')}
            width="400px"
          >
            <Link
              href="https://docs.formance.com/oss/ledger/get-started/hello-world"
              underline="none"
              target="_blank"
              rel="noopener"
            >
              <LoadingButton
                id="taskTutoButton"
                variant="dark"
                content={t('pages.overview.tasks.tuto.buttonText')}
                sx={{ mt: '12px' }}
                startIcon={<NorthEast />}
              />
            </Link>
          </OnBoarding>
          <OnBoarding
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
                id="taskUseCaseLibButton"
                variant="dark"
                content={t('pages.overview.tasks.useCaseLib.buttonText')}
                sx={{ mt: '12px' }}
                startIcon={<NorthEast />}
              />
            </Link>
          </OnBoarding>
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
            display="flex"
            flexWrap="wrap"
            data-testid="setup"
            justifyContent="flex-start"
            gap="26px"
          >
            {payments === 0 && (
              <OnBoarding
                title={t('pages.overview.setUp.connexion.title')}
                description={t('pages.overview.setUp.connexion.description')}
                width="400px"
              >
                <Link
                  id="setUpPayments"
                  href="https://docs.formance.com/oss/payments/reference/api"
                  underline="none"
                  target="_blank"
                  rel="noopener"
                >
                  <LoadingButton
                    variant="dark"
                    content={t('pages.overview.setUp.connexion.buttonText')}
                    sx={{ mt: '12px' }}
                    startIcon={<NorthEast />}
                  />
                </Link>
              </OnBoarding>
            )}
            {accounts === 0 && (
              <OnBoarding
                title={t('pages.overview.setUp.ledger.title')}
                description={t('pages.overview.setUp.ledger.description')}
                width="400px"
              >
                <Link
                  href="https://docs.formance.com/oss/ledger/reference/api"
                  underline="none"
                  target="_blank"
                  rel="noopener"
                >
                  <LoadingButton
                    variant="dark"
                    id="setUpLedger"
                    href="https://docs.formance.com/oss/ledger/reference/api"
                    content={t('pages.overview.setUp.ledger.buttonText')}
                    sx={{ mt: '12px' }}
                    startIcon={<NorthEast />}
                  />
                </Link>
              </OnBoarding>
            )}
          </Box>
        </Page>
      )}
    </>
  );
}
