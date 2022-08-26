import * as React from 'react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
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
import { AccountBalanceWallet, Add, Topic } from '@mui/icons-material';
import { ApiClient, API_LEDGER, API_SEARCH } from '~/src/utils/api';
import { getCurrentLedger } from '~/src/utils/localStorage';
import { useService } from '~/src/hooks/useService';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Cursor } from '~/src/types/generic';
import { Payment } from '~/src/types/payment';
import { SearchTargets } from '~/src/types/search';
import { useLoaderData } from '@remix-run/react';
import { Account } from '~/src/types/ledger';
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => ({
  title: 'Overview',
  description: 'Show a dashboard with tasks and status',
});

interface LoaderReturnValue {
  accounts: Cursor<Account> | undefined;
  payments: Cursor<Payment> | undefined;
}

export const loader: LoaderFunction = async () => {
  const payments = await new ApiClient().postResource<Cursor<Payment>>(
    API_SEARCH,
    {
      target: SearchTargets.PAYMENT,
      size: 1,
    },
    'cursor'
  );

  const accounts = await new ApiClient().postResource<Cursor<Account>>(
    API_SEARCH,
    {
      target: SearchTargets.ACCOUNT,
      size: 1,
    },
    'cursor'
  );

  return json({ accounts, payments });
};

export default function Index() {
  const { api } = useService();
  const { t } = useTranslation();
  const accountsAndPaymentsData =
    useLoaderData<LoaderReturnValue>() as LoaderReturnValue;

  // TODO check if the back send us back a serialized value so we don't have to use get anymore

  const accounts = get(
    accountsAndPaymentsData,
    'accounts.total.value',
    0
  ) as number;

  const payments = get(
    accountsAndPaymentsData,
    'payments.total.value',
    0
  ) as number;

  const shouldDisplaySetup = payments === 0 || accounts === 0;

  const [stats, setStats] = useState<{
    accounts: number;
    transactions: number;
  }>();

  useEffect(() => {
    (async () => {
      const currentLedger = getCurrentLedger();
      if (currentLedger) {
        const load = await api.getResource<any>(
          `${API_LEDGER}/${getCurrentLedger()}/stats`,
          'data'
        );
        if (load) {
          setStats(load);
        }
      }
    })();
  }, []);

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
                <TitleWithBar
                  title={t('pages.overview.status')}
                  titleColor={theme.palette.neutral[0]}
                />
                <Box mt={3} display="flex" data-testid="stats-card">
                  <Box mr={3}>
                    <StatsCard
                      icon={<Topic />}
                      variant="violet"
                      title={t('pages.overview.stats.transactions')}
                      mainValue={`${get(stats, 'transactions', '0')}`}
                    />
                  </Box>
                  <Box>
                    <StatsCard
                      icon={<AccountBalanceWallet />}
                      variant="brown"
                      title={t('pages.overview.stats.accounts')}
                      mainValue={`${get(stats, 'accounts', '0')}`}
                    />
                  </Box>
                </Box>
              </Box>
            </>
          </Page>
        </Box>
      </Box>
      {/* SET-UP */}
      {shouldDisplaySetup && (
        <Page
          title={
            <TitleWithBar title={t('pages.overview.setUp.sectionTitle')} />
          }
          id="tasks"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {payments === 0 && (
              <OnBoarding
                title={t('pages.overview.setUp.connexion.title')}
                description={t('pages.overview.setUp.connexion.description')}
              >
                <Link
                  href="https://docs.formance.com/oss/payments/reference/api"
                  underline="none"
                  target="_blank"
                  rel="noopener"
                >
                  <LoadingButton
                    variant="stroke"
                    content={t('pages.overview.setUp.connexion.buttonText')}
                    sx={{ mt: '12px' }}
                    startIcon={<Add />}
                  />
                </Link>
              </OnBoarding>
            )}
            {accounts === 0 && (
              <OnBoarding
                title={t('pages.overview.setUp.ledger.title')}
                description={t('pages.overview.setUp.ledger.description')}
              >
                <Link
                  href="https://docs.formance.com/oss/ledger/reference/api"
                  underline="none"
                  target="_blank"
                  rel="noopener"
                >
                  <LoadingButton
                    variant="stroke"
                    href="https://docs.formance.com/oss/ledger/reference/api"
                    content={t('pages.overview.setUp.ledger.buttonText')}
                    sx={{ mt: '12px' }}
                    startIcon={<Add />}
                  />
                </Link>
              </OnBoarding>
            )}
          </Box>
        </Page>
      )}

      {/*  TASKS */}
      <Page
        title={<TitleWithBar title={t('pages.overview.tasks')} />}
        id="tasks"
      >
        <></>
      </Page>
    </>
  );
}
