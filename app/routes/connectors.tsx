import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Page, Tabs } from '@numaryhq/storybook';

import {
  CreateForm as AppForm,
  CreateFormProps,
} from '~/routes/connectors/apps/CreateForm';
import { CreateForm as OAuthClientForm } from '~/routes/connectors/oauth-clients/CreateForm';
import { CreateForm as WebhookForm } from '~/routes/connectors/webhooks/CreateForm';
import {
  APPS_ROUTE,
  OAUTH_CLIENTS_ROUTE,
  WEBHOOKS_ROUTE,
} from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { Connector } from '~/src/types/connectorsConfig';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Connectors',
  description: 'Connectors',
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  async function handleData(session: Session) {
    const api = await createApiClient(session);

    if (url.pathname === APPS_ROUTE) {
      const connectors = await api.getResource<Connector[]>(
        `${API_PAYMENT}/connectors`,
        'data'
      );

      const configuration = await api.getResource<Connector[]>(
        `${API_PAYMENT}/connectors/configs`,
        'data'
      );

      if (connectors && configuration) {
        return { connectors, configuration };
      }

      return null;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="connectors"
      title="pages.connectors.title"
      error={error}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const connectorsData = useLoaderData<CreateFormProps>();
  console.log(connectorsData);
  const handleActive = (path: string) => location.pathname.includes(path);
  const config = [
    {
      active: handleActive('apps'),
      label: t('pages.connectors.tabs.apps.title'),
      onClick: () => navigate(APPS_ROUTE),
      type: 'apps',
      action: (
        <AppForm
          connectors={connectorsData?.connectors || []}
          configuration={connectorsData?.configuration || {}}
        />
      ),
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
    <Page id="connectors">
      <Box>
        <Tabs config={config} action={activeConfig && activeConfig.action} />
        <Outlet />
      </Box>
    </Page>
  );
}
