import * as React from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Chip, LoadingButton, Row } from '@numaryhq/storybook';

import { getRoute, APP_ROUTE } from '~/src/components/Navbar/routes';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { Connectors } from '~/src/types/connectorsConfig';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Apps',
  description: 'Apps',
});

type ConnectorsLoaderData = Connectors[];

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const connectorsStatus = await (
      await createApiClient(session)
    ).getResource<any>(`${API_PAYMENT}/connectors`, 'data');

    if (connectorsStatus) {
      return connectorsStatus;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const connectorsData = useLoaderData<ConnectorsLoaderData>();
  const navigate = useNavigate();

  const renderRowActions = (connector: Connectors) => (
    <Box sx={{ display: 'flex' }}>
      <LoadingButton
        id={`show-${connector.provider}`}
        onClick={() => navigate(getRoute(APP_ROUTE, connector.provider))}
        endIcon={<ArrowRight />}
      />
    </Box>
  );

  return (
    <Box mt={2}>
      <Table
        id="connectors-list"
        items={connectorsData}
        action={true}
        withPagination={false}
        columns={[
          {
            key: 'provider',
            label: t('pages.connectors.table.columnLabel.name'),
          },
          {
            key: 'disabled',
            label: t('pages.connectors.table.columnLabel.status'),
          },
        ]}
        renderItem={(connector: Connectors, index: number) => (
          <Row
            key={index}
            item={connectorsData}
            renderActions={() => renderRowActions(connector)}
            keys={[
              <ProviderPicture key={index} provider={connector.provider} />,
              <Chip
                key={index}
                color={connector.disabled ? 'green' : 'red'}
                label={
                  connector.disabled
                    ? t('common.status.active')
                    : t('common.status.error')
                }
                variant="square"
              />,
            ]}
          />
        )}
      />
    </Box>
  );
}
