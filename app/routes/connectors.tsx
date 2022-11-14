import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { Page, Tabs } from '@numaryhq/storybook';

import { CreateConnectorForm as AppsForm } from '~/routes/connectors/apps/CreateConnectorForm';
import { CreateForm as OAuthClientForm } from '~/routes/connectors/oauth-clients/CreateForm';
import { CreateForm as WebhookForm } from '~/routes/connectors/webhooks/CreateForm';
import {
  connectors as connectorsConfig,
  APPS_ROUTE,
  OAUTH_CLIENTS_ROUTE,
  WEBHOOKS_ROUTE,
} from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';

export const meta: MetaFunction = () => ({
  title: 'Connectors',
  description: 'Connectors',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={connectorsConfig.id}
      title="pages.connectors.title"
      error={error}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleActive = (path: string) => location.pathname.includes(path);

  const config = [
    {
      active: handleActive('apps'),
      label: t('pages.connectors.tabs.apps.title'),
      onClick: () => navigate(APPS_ROUTE),
      type: 'connectors',
      action: <AppsForm />,
    },
    {
      active: handleActive('oauth-clients'),
      label: t('pages.connectors.tabs.oAuthClients.title'),
      onClick: () => navigate(OAUTH_CLIENTS_ROUTE),
      type: 'oAuthClients',
      action: <OAuthClientForm />,
    },
    {
      active: handleActive('webhooks'),
      label: t('pages.connectors.tabs.webhooks.title'),
      onClick: () => navigate(WEBHOOKS_ROUTE),
      type: 'webhooks',
      action: <WebhookForm />,
    },
  ];

  const activeConfig = config.find((item) => item.active);

  return (
    <Page id={connectorsConfig.id}>
      <Box>
        <Tabs config={config} action={activeConfig && activeConfig.action} />
        <Outlet />
      </Box>
    </Page>
  );
}
