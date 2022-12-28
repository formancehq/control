import * as React from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Chip, LoadingButton, Row } from '@numaryhq/storybook';

import { APP_ROUTE, getRoute } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { Connector } from '~/src/types/connectorsConfig';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

export const meta: MetaFunction = () => ({
  title: 'Apps',
  description: 'Apps',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return <ComponentErrorBoundary id="apps" error={error} showAction={false} />;
}

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const connectors = await (
      await createApiClient(session)
    ).getResource<Connector[]>(`${API_PAYMENT}/connectors`, 'data');
    if (connectors) {
      return connectors;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const connectorsData = useLoaderData<Connector[]>();
  const navigate = useNavigate();

  const renderRowActions = (connector: Connector) => (
    <LoadingButton
      id={`show-${connector.provider}`}
      onClick={() =>
        navigate(getRoute(APP_ROUTE, connector.provider.toLowerCase()))
      }
      endIcon={<ArrowRight />}
      key={connector.provider}
    />
  );

  return (
    <Box mt={2}>
      <Table
        id="connectors-list"
        items={connectorsData}
        action
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
        renderItem={(connector: Connector, index: number) => (
          <Row
            key={index}
            item={connectorsData}
            renderActions={() => renderRowActions(connector)}
            keys={[
              <ProviderPicture
                key={index}
                provider={lowerCaseAllWordsExceptFirstLetter(
                  connector.provider
                )}
              />,
              <Chip
                key={index}
                color={connector.disabled ? 'red' : 'green'}
                label={
                  connector.disabled
                    ? t('common.status.inactive')
                    : t('common.status.active')
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
