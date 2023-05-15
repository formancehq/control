import * as React from 'react';
import { FunctionComponent } from 'react';

import { NorthEast, Person } from '@mui/icons-material';
import { Avatar, Box, Link, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { useTranslation } from 'react-i18next';

import {
  ActionCard,
  LoadingButton,
  Page,
  TitleWithBar,
} from '@numaryhq/storybook';

import { overview } from '~/src/components/Layout/routes';
import { useService } from '~/src/hooks/useService';

export const meta: MetaFunction = () => ({
  title: 'Overview',
  description: 'Show a dashboard with tasks and status',
});

export function ErrorBoundary() {
  return <Overview />;
}

export default function Index() {
  return <Overview />;
}

const Overview: FunctionComponent = () => {
  const { t } = useTranslation();
  const { currentUser } = useService();

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
    </>
  );
};
