import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { Page, TabButton } from '@numaryhq/storybook';

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

  const currentSubRouteElement = isPathNameOauthApps
    ? {
        actionLabel: t(
          'pages.connectors.tabs.oAuthClients.pageButton.actionLabel'
        ),
        onClick: () => 'TODO',
        actionId: t('pages.connectors.tabs.oAuthClients.pageButton.actionId'),
        actionEvent: t(
          'pages.connectors.tabs.oAuthClients.pageButton.actionEvent'
        ),
      }
    : {
        actionLabel: t('pages.connectors.tabs.apps.pageButton.actionLabel'),
        onClick: () => 'TODO',
        actionId: t('pages.connectors.tabs.apps.pageButton.actionId'),
        actionEvent: t('pages.connectors.tabs.apps.pageButton.actionEvent'),
      };

  return (
    <Page
      id={connectorsConfig.id}
      actionLabel={currentSubRouteElement.actionLabel}
      actionId={currentSubRouteElement.actionId}
      onClick={currentSubRouteElement.onClick}
      actionEvent={currentSubRouteElement.actionEvent}
    >
      <Box>
        <Box sx={{ display: 'flex', width: '30%' }}>
          <TabButton
            active={!isPathNameOauthApps}
            label={t('pages.connectors.tabs.apps.title')}
            map={{}}
            onClick={() => navigate(CONNECTORS_ROUTE)}
            type="connectors"
          />
          <TabButton
            active={isPathNameOauthApps}
            label={t('pages.connectors.tabs.oAuthClients.title')}
            map={{}}
            onClick={() => navigate(OAUTH_CLIENTS_ROUTE)}
            type="oAuthClients"
          />
        </Box>
        <Outlet />
      </Box>
    </Page>
  );
}
