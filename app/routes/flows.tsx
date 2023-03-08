import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { Page, Tabs } from '@numaryhq/storybook';

import {
  INSTANCES_ROUTE,
  WORKFLOWS_ROUTE,
} from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';

export const meta: MetaFunction = () => ({
  title: 'Flows',
  description: 'Flows',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="flows"
      title="pages.flows.title"
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
      active: handleActive('workflows'),
      label: t('pages.flows.tabs.workflows.title'),
      onClick: () => navigate(WORKFLOWS_ROUTE),
      type: 'workflows',
    },
    {
      active: handleActive('instances'),
      label: t('pages.flows.tabs.instances.title'),
      onClick: () => navigate(INSTANCES_ROUTE),
      type: 'instances',
    },
  ];

  return (
    <Page id="connectors">
      <Box>
        <Tabs config={config} />
        <Outlet />
      </Box>
    </Page>
  );
}
