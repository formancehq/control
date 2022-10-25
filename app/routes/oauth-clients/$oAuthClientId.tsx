import * as React from 'react';
import { useState } from 'react';

import { Add, Close, Delete, Done } from '@mui/icons-material';
import { Alert, Box, Grid, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get, omit } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  Chip,
  LoadingButton,
  Page,
  Row,
  SectionWrapper,
  theme,
} from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import Modal from '~/src/components/Wrappers/Modal';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import { OAuthClient, OAuthSecret } from '~/src/types/oauthClient';
import { API_AUTH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { copyTokenToClipboard } from '~/src/utils/clipboard';

export const meta: MetaFunction = () => ({
  title: 'OAuth Client',
  description: 'Show oauth client',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="oAuthClient"
      title="pages.oAuthClient.title"
      error={error}
      showAction={false}
    />
  );
}
export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.oAuthClientId, 'Expected params.oAuthClientId');
    const oauthClient = await (
      await createApiClient(session)
    ).getResource<any>(`${API_AUTH}/clients/${params.oAuthClientId}`, 'data');

    if (oauthClient) {
      return oauthClient;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const oAuthClient = useLoaderData<OAuthClient>() as OAuthClient;
  const { t } = useTranslation();
  const { api } = useService();
  const location = useLocation();
  const createdSecret = get(location, 'state.secret');
  const { oAuthClientId: id } = useParams<{
    oAuthClientId: string;
  }>();
  const [secrets, setSecrets] = useState<OAuthSecret[]>(
    oAuthClient.Secrets.map((secret) => ({ ...secret, clear: undefined }))
  );

  const onDelete = async (idSecret: string) => {
    const result = await api.deleteResource<unknown>(
      `${API_AUTH}/clients/${id}/secrets/${idSecret}`
    );
    if (result) {
      setSecrets(secrets.filter((secret) => secret.id !== idSecret));
    }
  };

  const renderRowActions = (secret: OAuthSecret) => (
    <Box component="span" key={secret.id}>
      <Modal
        button={{
          id: `delete-${secret.id}`,
          startIcon: <Delete />,
        }}
        modal={{
          id: `delete-${secret.id}-modal`,
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.deleteTitle'),
          actions: {
            save: {
              variant: 'error',
              label: t('common.dialog.confirmButton'),
              onClick: () => onDelete(secret.id),
            },
          },
        }}
      >
        <Typography>
          <Trans
            i18nKey="common.dialog.messages.confirmDelete"
            values={{ item: secret.lastDigits }}
            components={{ bold: <strong /> }}
          />
        </Typography>
      </Modal>
    </Box>
  );
  const handleCreateSecret = async () => {
    const secret = await api.postResource<OAuthSecret>(
      `${API_AUTH}/clients/${id}/secrets`,
      {},
      'data'
    );
    if (secret) {
      const secretList = [...secrets, secret];
      setSecrets(secretList);
    }
  };

  return (
    <Page id="oAuthClient" title={t('pages.oAuthClient.title')}>
      <Box mt="26px">
        {createdSecret && secrets.length === 1 && (
          <Alert
            severity="info"
            sx={{
              marginBottom: 3,
            }}
          >
            {t('pages.oAuthClient.sections.secrets.clear')}
            <Chip
              sx={{ marginLeft: 1 }}
              onClick={() => copyTokenToClipboard(createdSecret)}
              label={createdSecret}
              color="blue"
              variant="square"
            />
          </Alert>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 26px 26px 26px',
            backgroundColor: theme.palette.neutral[0],
          }}
        >
          <SectionWrapper title={t('pages.oAuthClient.sections.details.title')}>
            <>
              {Object.keys(
                omit(oAuthClient, [
                  'secrets',
                  'metadata',
                  'scopes',
                  'redirectUris',
                  'Secrets',
                  'postLogoutRedirectUris',
                  'id',
                ])
              ).map((key: string, index: number) => {
                const item = get(oAuthClient, key);

                return (
                  <Grid container key={index}>
                    <Grid item xs={2}>
                      <Typography variant="bold">
                        {t(`pages.oAuthClient.sections.details.${key}`)}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      {typeof item === 'boolean' ? (
                        <>{item ? <Done /> : <Close />}</>
                      ) : (
                        <Typography>{item}</Typography>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
            </>
          </SectionWrapper>
          <SectionWrapper title={t('pages.oAuthClient.sections.secrets.title')}>
            <Box>
              <Box display="flex" justifyContent="end" mb={2}>
                <LoadingButton
                  id={`create-secret-${id}`}
                  onClick={handleCreateSecret}
                  startIcon={<Add />}
                  variant="dark"
                  content={t('pages.oAuthClient.sections.secrets.create')}
                />
              </Box>
              <Table
                id="oauth-client-secrets-list"
                items={secrets}
                action={true}
                withPagination={false}
                columns={[
                  {
                    key: 'lastDigits',
                    label: t(
                      'pages.oAuthClient.sections.secrets.table.columnLabel.lastDigits'
                    ),
                  },
                  {
                    key: 'clear',
                    label: t(
                      'pages.oAuthClient.sections.secrets.table.columnLabel.clear'
                    ),
                  },
                ]}
                renderItem={(secret: OAuthSecret, index: number) => (
                  <Row
                    key={index}
                    keys={[
                      <Typography
                        key={index}
                      >{`*************${secret.lastDigits}`}</Typography>,
                      <>
                        {secret.clear && (
                          <Alert
                            key={index}
                            severity="info"
                            sx={{
                              backgroundColor: 'transparent',
                              border: '0 !important',
                            }}
                          >
                            <Box component="span" sx={{ display: 'block' }}>
                              {t('pages.oAuthClient.sections.secrets.clear')}
                            </Box>
                            <Chip
                              onClick={() =>
                                copyTokenToClipboard(secret.clear || '')
                              }
                              sx={{ marginLeft: 1 }}
                              label={secret.clear}
                              color="blue"
                              variant="square"
                            />
                          </Alert>
                        )}
                      </>,
                    ]}
                    item={secret}
                    renderActions={() => renderRowActions(secret)}
                  />
                )}
              />
            </Box>
          </SectionWrapper>
        </Box>
      </Box>
    </Page>
  );
}
