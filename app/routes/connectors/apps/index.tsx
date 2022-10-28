import * as React from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Row } from '@numaryhq/storybook';

import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { ApiClient } from '~/src/utils/api';

export const meta: MetaFunction = () => ({
  title: 'Apps',
  description: 'Apps',
});

export type CreateStripeConnector = {
  connector: string;
  pollingPeriod: string;
  secretKey: string;
  pageSize: string;
};

export type CreateDummyPayConnector = {
  filePollingPeriod: string;
  fileGenerationPeriod: string;
  directory: string;
};

export type CreateWiseConnector = {
  apiKey: string;
};

export type CreateModulrConnector = {
  apiKey: string;
  apiSecret: string;
  endpoint: string;
};

export type ConnectorParams =
  | CreateStripeConnector
  | CreateDummyPayConnector
  | CreateWiseConnector
  | CreateModulrConnector;

export const submit = async (values: ConnectorParams, api: ApiClient) => {
  console.log({ values });
};

export const loader: LoaderFunction = async ({ request }) => {
  const connectors = [
    {
      id: '1',
      name: 'Stripe',
      description: 'Stripe',
      status: 'Active',
    },
  ];

  return { connectors };
};

export default function Index() {
  const { t } = useTranslation();
  const { connectors } = useLoaderData();

  return (
    <Box mt={2}>
      <Table
        id="connectors-list"
        items={connectors}
        action={true}
        withPagination={false}
        columns={[
          {
            key: 'name',
            label: t('pages.connectors.table.columnLabel.name'),
          },
          {
            key: 'status',
            label: t('pages.connectors.table.columnLabel.status'),
          },
        ]}
        renderItem={(connector: any, index: number) => (
          <Row
            key={index}
            keys={[
              <ProviderPicture key={index} provider={connector.name} />,
              <Box key={index}>{connector.status}</Box>,
            ]}
            item={connectors}
            renderActions={() => <MoreHorizIcon />}
          />
        )}
      />
    </Box>
  );
}
