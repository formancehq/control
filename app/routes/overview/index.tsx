import * as React from 'react';
import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Box, Button } from '@mui/material';
import { overview } from '~/src/components/Navbar/routes';
import {
  OnBoarding,
  Page,
  StatsCard,
  theme,
  TitleWithBar,
} from '@numaryhq/storybook';
import { AccountBalanceWallet, Add, Topic } from '@mui/icons-material';
import { API_LEDGER } from '~/src/utils/api';
import { getCurrentLedger } from '~/src/utils/localStorage';
import { useService } from '~/src/hooks/useService';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';

export const meta: MetaFunction = () => ({
  title: 'Overview',
  description: 'Show a dashboard with tasks and status',
});

export default function Index() {
  const { api } = useService();
  const { t } = useTranslation();
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
      <Page
        title={<TitleWithBar title={t('pages.overview.setUp.sectionTitle')} />}
        id="tasks"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <OnBoarding
            title={t('pages.overview.setUp.connexion.title')}
            description={t('pages.overview.setUp.connexion.description')}
          >
            <Button variant="outlined" sx={{ mt: '12px' }} startIcon={<Add />}>
              {t('pages.overview.setUp.connexion.buttonText')}
            </Button>
          </OnBoarding>
          <OnBoarding
            title={t('pages.overview.setUp.ledger.title')}
            description={t('pages.overview.setUp.ledger.description')}
          >
            <Button variant="outlined" sx={{ mt: '12px' }} startIcon={<Add />}>
              {t('pages.overview.setUp.ledger.buttonText')}
            </Button>
          </OnBoarding>
        </Box>
      </Page>

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
