import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { Page, Tabs } from '@numaryhq/storybook';

import { CreateForm } from '~/routes/connectors/oauth-clients/CreateForm';
import {
  connectors as connectorsConfig,
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

  const handleActive = (path: string) => location.pathname.includes(path);

  const config = [
    // TODO uncomment when connectors feature is ready
    // {
    //   active: handleActive('apps'),
    //   label: t('pages.connectors.tabs.apps.title'),
    //   onClick: () => navigate(APPS_ROUTE),
    //   type: 'connectors',
    //   action: <CreateConnectorsForm />,
    // },
    {
      active: handleActive('oauth-clients'),
      label: t('pages.connectors.tabs.oAuthClients.title'),
      onClick: () => navigate(OAUTH_CLIENTS_ROUTE),
      type: 'oAuthClients',
      action: <CreateForm />,
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
