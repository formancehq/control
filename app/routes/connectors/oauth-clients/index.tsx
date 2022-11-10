import * as React from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, LoadingButton, Row } from '@numaryhq/storybook';

import { getRoute, OAUTH_CLIENT_ROUTE } from '~/src/components/Navbar/routes';
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
  const oAuthClients = useLoaderData() as OAuthClient[];
  const navigate = useNavigate();
  const { currentUser } = useService();
  console.log('controle', currentUser);

  const renderRowActions = (oauthClient: OAuthClient) => (
    <Box
      component="span"
      key={oauthClient.id}
      display="inline-flex"
      sx={{ float: 'right' }}
    >
      <LoadingButton
        id={`show-${oauthClient.id}`}
        onClick={() => navigate(getRoute(OAUTH_CLIENT_ROUTE, oauthClient.id))}
        endIcon={<ArrowRight />}
      />
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
                color="yellow"
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
