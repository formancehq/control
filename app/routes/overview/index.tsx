import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Avatar, Box, Link, Typography } from '@mui/material';
import {
  getRoute,
  LEDGERS_ROUTE,
  overview,
} from '~/src/components/Navbar/routes';
import {
  EmptyState,
  LoadingButton,
  Page,
  StatsCard,
} from '@numaryhq/storybook';
import {
  AccountBalanceWallet,
  GitHub,
  Person,
  ReadMore,
  Topic,
} from '@mui/icons-material';
import { API_LEDGER } from '~/src/utils/api';
import { getCurrentLedger } from '~/src/utils/localStorage';
import { useService } from '~/src/hooks/useService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const meta: MetaFunction = () => ({
  title: 'Dashboard',
  description: 'Display beautiful metrics !',
});

const Item: FunctionComponent<{
  link: string;
  title: string;
  variant: 'brown' | 'blue' | 'green' | 'violet';
}> = ({ link, title, variant }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      width: 300,
      height: 50,
      borderLeft: ({ palette }) => `3px solid ${palette[variant].bright}`,
      color: ({ palette }) => palette.primary.main,
      m: 1,
      p: 1,
    }}
  >
    <Link href={link} target="_blank" sx={{ textDecoration: 'none' }}>
      <Typography ml={2} variant="body1">
        {title}
      </Typography>
    </Link>
  </Box>
);

export default function Index() {
  const { api } = useService();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          height: 650,
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex">
                  <Avatar
                    sx={{
                      backgroundColor: ({ palette }) => palette.neutral[800],
                      width: 72,
                      height: 72,
                    }}
                  >
                    <Person fontSize="large" />
                  </Avatar>
                  <Box display="flex-column" p={2} alignItems="center">
                    <Typography
                      variant="headline"
                      sx={{ color: ({ palette }) => palette.neutral[0] }}
                    >
                      {`${t('pages.overview.hello')} 👋`}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: ({ palette }) => palette.neutral[400] }}
                    >
                      {t('pages.overview.subtitle')}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <LoadingButton
                    startIcon={<GitHub />}
                    content={t('pages.overview.githubContent')}
                    sx={{ marginRight: 2 }}
                    onClick={() =>
                      window.open('https://github.com/numary/ledger')
                    }
                  />
                  <LoadingButton
                    startIcon={<ReadMore />}
                    variant="primary"
                    content={t('pages.overview.docsContent')}
                    onClick={() =>
                      window.open('https://docs.formance.com/oss/ledger')
                    }
                  />
                </Box>
              </Box>
              {/*  STATUS */}
              {getCurrentLedger() ? (
                <Box mt={5}>
                  <Typography variant="h1" color="secondary">
                    {t('pages.overview.status')}
                  </Typography>
                  {stats && (
                    <Box mt={3} display="flex">
                      <Box mr={3}>
                        <StatsCard
                          icon={<Topic />}
                          variant="violet"
                          title={t('pages.overview.stats.transactions')}
                          mainValue={`${stats.transactions}`}
                        />
                      </Box>
                      <Box>
                        <StatsCard
                          icon={<AccountBalanceWallet />}
                          variant="brown"
                          title={t('pages.overview.stats.accounts')}
                          mainValue={`${stats.accounts}`}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box mt={5}>
                  {' '}
                  <EmptyState
                    variant="dark"
                    title={t('pages.ledgers.emptyState.title')}
                    description={t('pages.ledgers.emptyState.description')}
                  >
                    <Box mt={3}>
                      <LoadingButton
                        content="Choose my ledger"
                        variant="primary"
                        onClick={() => navigate(getRoute(LEDGERS_ROUTE))}
                      />
                    </Box>
                  </EmptyState>
                </Box>
              )}
            </>
          </Page>
        </Box>
      </Box>
      {/*  TASKS */}
      <Page title="Tasks" id="tasks">
        <>
          <Item
            link="https://airtable.com/shrDrr55Oke7z1B2G"
            title={`🗳 ${t('pages.overview.airtableContent')}`}
            variant="green"
          />
          <Item
            link="https://eepurl.com/hTpCFH"
            title={`📮 ${t('pages.overview.newsletterContent')}`}
            variant="violet"
          />
          <Item
            link="https://discord.com/invite/xyHvcbzk4w"
            title={`💬 ${t('pages.overview.discordContent')}`}
            variant="blue"
          />
        </>
      </Page>
    </>
  );
}
