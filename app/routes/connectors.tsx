import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { Page, Tabs } from '@numaryhq/storybook';

import {
  connectors as connectorsConfig,
  CONNECTORS_ROUTE,
  OAUTH_CLIENTS_ROUTE,
} from '~/src/components/Navbar/routes';

export const meta: MetaFunction = () => ({
  title: 'Connectors',
  description: 'Connectors',
});

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // TODO make factory when we add webhooks
  const isPathNameOauthApps = location.pathname.includes('oauth-clients');

  const config = [
    {
      active: !isPathNameOauthApps,
      label: t('pages.connectors.tabs.apps.title'),
      onClick: () => navigate(CONNECTORS_ROUTE),
      type: 'connectors',
    },
    {
      active: isPathNameOauthApps,
      label: t('pages.connectors.tabs.oAuthClients.title'),
      onClick: () => navigate(OAUTH_CLIENTS_ROUTE),
      type: 'oAuthClients',
    },
  ];

  return (
    <Page id={connectorsConfig.id}>
      <Box display="flex">
        <Tabs config={config} />
        <Outlet />
      </Box>
    </Page>
  );
}
