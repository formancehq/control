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

export const meta: MetaFunction = () => ({
  title: 'Apps',
  description: 'Apps',
});

type Connectors = {
  name: string;
  status: string;
};

type ConnectorsLoaderData = {
  connectors: Connectors[];
};

export const loader: LoaderFunction = async () => {
  const connectors = [
    {
      name: 'Stripe',
      status: 'Active',
    },
  ];

  return { connectors };
};

export default function Index() {
  const { t } = useTranslation();
  const { connectors } = useLoaderData<ConnectorsLoaderData>();

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
        renderItem={(connector: Connectors, index: number) => (
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
