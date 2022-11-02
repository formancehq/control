import * as React from 'react';
import { useState } from 'react';

import { ArrowRight, Delete } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, LoadingButton, Row } from '@numaryhq/storybook';

import { getRoute, OAUTH_CLIENT_ROUTE } from '~/src/components/Navbar/routes';
import Modal from '~/src/components/Wrappers/Modal';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import { OAuthClient } from '~/src/types/oauthClient';
import { API_AUTH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'OAuth clients',
  description: 'List',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const oauthClients = await (
      await createApiClient(session)
    ).getResource<OAuthClient[]>(`${API_AUTH}/clients`, 'data');

    if (oauthClients) {
      return oauthClients;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const data = useLoaderData();
  const navigate = useNavigate();
  const { api, snackbar } = useService();
  const [oAuthClients, setOAuthClients] = useState<OAuthClient[]>(data);

  const onDelete = async (id: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_AUTH}/clients/${id}`
      );
      if (result) {
        setOAuthClients(oAuthClients.filter((client) => client.id !== id));
      }
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: `${t(
            'pages.oAuthClient.sections.secrets.deleteFeedback'
          )} ${id}`,
        })
      );
    }
  };

  const renderRowActions = (oauthClient: OAuthClient) => (
    <Box component="span" key={oauthClient.id} display="inline-flex">
      <LoadingButton
        id={`show-${oauthClient.id}`}
        onClick={() => navigate(getRoute(OAUTH_CLIENT_ROUTE, oauthClient.id))}
        endIcon={<ArrowRight />}
      />
      <Modal
        button={{
          id: `delete-${oauthClient.id}`,
          startIcon: <Delete />,
        }}
        modal={{
          id: `delete-${oauthClient.id}-modal`,
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.deleteTitle'),
          actions: {
            save: {
              variant: 'error',
              label: t('common.dialog.confirmButton'),
              onClick: () => onDelete(oauthClient.id),
            },
          },
        }}
      >
        <Typography>
          <Trans
            i18nKey="common.dialog.messages.confirmDelete"
            values={{ item: oauthClient.name }}
            components={{ bold: <strong /> }}
          />
        </Typography>
      </Modal>
    </Box>
  );

  return (
    <Box mt={2}>
      <Table
        id="oauth-clients-list"
        items={oAuthClients}
        action
        withPagination={false}
        columns={[
          {
            key: 'name',
            label: t('pages.oAuthClients.table.columnLabel.name'),
            width: 20,
          },
          {
            key: 'public',
            label: t('pages.oAuthClients.table.columnLabel.public'),
          },
          {
            key: 'description',
            label: t('pages.oAuthClients.table.columnLabel.description'),
          },
        ]}
        renderItem={(oAuthClient: OAuthClient, index: number) => (
          <Row
            key={index}
            keys={[
              'name',
              <Chip
                key={index}
                label={t(
                  `pages.oAuthClients.table.rows.${
                    oAuthClient.public ? 'public' : 'private'
                  }`
                )}
                variant="square"
                color={oAuthClient.public ? 'green' : 'red'}
              />,
              'description',
            ]}
            item={oAuthClient}
            renderActions={() => renderRowActions(oAuthClient)}
          />
        )}
      />
    </Box>
  );
}
