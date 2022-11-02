import * as React from 'react';
import { useState } from 'react';

import { RestartAlt, Delete } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Trans, useTranslation } from 'react-i18next';

import { Chip, Row } from '@numaryhq/storybook';

import Modal from '~/src/components/Wrappers/Modal/Modal';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Apps',
  description: 'Apps',
});

type Connectors = {
  provider: string;
  disabled: boolean;
};

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
  const [connectors, setConnectors] = useState<Connectors[]>(connectorsData);

  const { api, snackbar } = useService();

  const onDelete = async (connectorName: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_PAYMENT}/connectors/${connectorName}`
      );
      if (result) {
        setConnectors(
          connectorsData.filter(
            (currentConnector) => currentConnector.provider !== connectorName
          )
        );
      }
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: connectorName,
        })
      );
    }
  };

  const onReset = async (connectorName: string) => {
    try {
      await api.postResource<unknown>(
        `${API_PAYMENT}/connectors/${connectorName}/reset`,
        {}
      );
    } catch {
      snackbar(t('common.feedback.error'));
    }
  };

  const renderRowActions = (connector: Connectors) => (
    <Box sx={{ display: 'flex' }}>
      <Modal
        button={{
          id: `delete-${connector.provider}`,
          startIcon: <Delete />,
        }}
        modal={{
          id: `delete-${connector.provider}-modal`,
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.deleteTitle'),
          actions: {
            save: {
              variant: 'error',
              label: t('common.dialog.confirmButton'),
              onClick: () => onDelete(connector.provider),
            },
          },
        }}
      >
        <Typography>
          <Trans
            i18nKey="common.dialog.messages.confirmDelete"
            values={{ item: connector.provider }}
            components={{ bold: <strong /> }}
          />
        </Typography>
      </Modal>
      <Modal
        button={{
          id: `reset-${connector.provider}`,
          startIcon: <RestartAlt />,
        }}
        modal={{
          id: `reset-${connector.provider}-modal`,
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.confirmation', {
            action: t('common.dialog.resetTitle'),
          }),
          actions: {
            save: {
              variant: 'error',
              label: t('common.dialog.confirmButton'),
              onClick: () => onReset(connector.provider),
            },
          },
        }}
      >
        <Typography>
          <Trans
            i18nKey="common.dialog.messages.reset"
            values={{ item: connector.provider }}
            components={{ bold: <strong /> }}
          />
        </Typography>
      </Modal>
    </Box>
  );

  return (
    <Box mt={2}>
      <Table
        id="connectors-list"
        items={connectors}
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
            item={connectors}
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
