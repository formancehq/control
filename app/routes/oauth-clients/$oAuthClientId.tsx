import * as React from 'react';
import { useState } from 'react';

import { Add, Delete } from '@mui/icons-material';
import { Alert, Box, Grid, Typography, useTheme } from '@mui/material';
import { ColorVariants } from '@numaryhq/storybook/dist/cjs/types/types';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get, pick } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  ActionZone,
  Chip,
  Page,
  Row,
  Secret,
  SectionWrapper,
} from '@numaryhq/storybook';

import { getRoute, OAUTH_CLIENTS_ROUTE } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import DetailPage from '~/src/components/Wrappers/DetailPage';
import Modal from '~/src/components/Wrappers/Modal';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import { OAuthClient, OAuthSecret } from '~/src/types/oauthClient';
import { API_AUTH } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

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
  const { api, snackbar } = useService();
  const { oAuthClientId: id } = useParams<{
    oAuthClientId: string;
  }>();
  const [secrets, setSecrets] = useState<OAuthSecret[]>(
    oAuthClient.secrets.map((secret) => ({ ...secret, clear: undefined }))
  );
  const navigate = useNavigate();
  const { typography } = useTheme();

  const renderUris = (key: string, color?: ColorVariants) => {
    const uris = get(oAuthClient, key, []) || [];

    return (
      <>
        {uris.length > 0 && (
          <Grid container sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={2}>
              <Typography variant="bold">
                {t(`pages.oAuthClient.sections.details.${key}`)}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              {uris.lenght > 0 ? (
                uris.map((uri: string, index: number) => (
                  <Chip
                    key={index}
                    label={uri}
                    color={color}
                    variant="square"
                    sx={{ marginRight: 1 }}
                  />
                ))
              ) : (
                <Typography variant="placeholder">
                  {t('pages.oAuthClient.sections.details.uris.placeholder')}
                </Typography>
              )}
            </Grid>
          </Grid>
        )}
      </>
    );
  };
  const onDeleteClient = async (id: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_AUTH}/clients/${id}`
      );
      if (result) {
        navigate(getRoute(OAUTH_CLIENTS_ROUTE));
      }
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: `${t('pages.oAuthClient.title')} ${id}`,
        })
      );
    }
  };

  const onDelete = async (idSecret: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_AUTH}/clients/${id}/secrets/${idSecret}`
      );
      if (result) {
        setSecrets(secrets.filter((secret) => secret.id !== idSecret));
      }
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: `${t('pages.oAuthClient.title')} ${id}`,
        })
      );
    }
  };

  const renderRowActions = (secret: OAuthSecret) => (
    <Box component="span" key={secret.id} sx={{ float: 'right' }}>
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
      const secretList = [...secrets, secret] as OAuthSecret[];
      setSecrets(secretList);
    }
  };

  return (
    <Page id="oAuthClient" title={t('pages.oAuthClient.title')}>
      <DetailPage>
        <>
          <SectionWrapper title={t('pages.oAuthClient.sections.details.title')}>
            <>
              {/* ID */}
              <Grid container sx={{ mb: 1, mt: 2 }}>
                <Grid item xs={2}>
                  <Typography variant="bold">
                    {t('pages.oAuthClients.table.columnLabel.id')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Chip variant="square" label={oAuthClient.id} />
                </Grid>
              </Grid>
              {/* Type */}
              <Grid container sx={{ mb: 1, mt: 2 }}>
                <Grid item xs={2}>
                  <Typography variant="bold">
                    {t('pages.oAuthClients.table.columnLabel.public')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Chip
                    label={t(
                      `pages.oAuthClients.table.rows.${
                        oAuthClient.public ? 'public' : 'private'
                      }`
                    )}
                    variant="square"
                    color="yellow"
                  />
                </Grid>
              </Grid>
              {/* Name / description */}
              {Object.keys(pick(oAuthClient, ['name', 'description'])).map(
                (key: string, index: number) => {
                  const item = get(oAuthClient, key);
                  if (item)
                    return (
                      <Grid container key={index} sx={{ marginBottom: 2 }}>
                        <Grid item xs={2}>
                          <Typography variant="bold">
                            {t(`pages.oAuthClient.sections.details.${key}`)}
                          </Typography>
                        </Grid>
                        <Grid item xs={10}>
                          <Typography>{item}</Typography>
                        </Grid>
                      </Grid>
                    );
                }
              )}
              {/* Redirect uri */}
              {renderUris('redirectUris', 'violet')}
              {/* Post logout uri */}
              {renderUris('postLogoutRedirectUris', 'green')}
            </>
          </SectionWrapper>
          <SectionWrapper
            title={t('pages.oAuthClient.sections.secrets.title')}
            button={{
              id: `create-secret-${id}`,
              onClick: handleCreateSecret,
              startIcon: <Add />,
              variant: 'dark',
              content: t('pages.oAuthClient.sections.secrets.create'),
            }}
          >
            <Box mt={2}>
              <Table
                id="oauth-client-secrets-list"
                items={secrets}
                action
                columns={[]}
                withPagination={false}
                withHeader={false}
                renderItem={(secret: OAuthSecret, index: number) => (
                  <Row
                    key={index}
                    keys={[
                      <Secret lastDigits={secret.lastDigits} key={index} />,
                      <Box component="span" key={index}>
                        {secret.clear && (
                          <Alert
                            key={index}
                            severity="info"
                            sx={{
                              backgroundColor: 'transparent',
                              border: '0 !important',
                              '.MuiAlert-message': {
                                ...typography.body1,
                              },
                            }}
                          >
                            <Box component="span" sx={{ display: 'block' }}>
                              {t('pages.oAuthClient.sections.secrets.clear')}
                            </Box>
                            <Secret
                              key={index}
                              lastDigits="13cd"
                              value={secret.clear || ''}
                              color="blue"
                              tooltipMessage={t('common.tooltip.copied')}
                            />
                          </Alert>
                        )}
                      </Box>,
                    ]}
                    item={secret}
                    renderActions={() => renderRowActions(secret)}
                  />
                )}
              />
            </Box>
          </SectionWrapper>
          <SectionWrapper
            title={t('pages.oAuthClient.sections.dangerZone.title')}
          >
            <ActionZone
              actions={[
                {
                  key: 'delete-oAuthClient',
                  title: t(
                    'pages.oAuthClient.sections.dangerZone.delete.title'
                  ),
                  description: t(
                    'pages.oAuthClient.sections.dangerZone.delete.description'
                  ),
                  button: (
                    <Modal
                      button={{
                        id: `delete-${oAuthClient.id}`,
                        startIcon: <Delete />,
                        content: t('common.buttons.delete'),
                        variant: 'error',
                      }}
                      modal={{
                        id: `delete-${oAuthClient.id}-modal`,
                        PaperProps: { sx: { minWidth: '500px' } },
                        title: t('common.dialog.deleteTitle'),
                        actions: {
                          save: {
                            variant: 'error',
                            label: t('common.dialog.confirmButton'),
                            onClick: () => onDeleteClient(oAuthClient.id),
                          },
                        },
                      }}
                    >
                      <Typography>
                        <Trans
                          i18nKey="common.dialog.messages.confirmDelete"
                          values={{ item: oAuthClient.name }}
                          components={{ bold: <strong /> }}
                        />
                      </Typography>
                    </Modal>
                  ),
                },
              ]}
            />
          </SectionWrapper>
        </>
      </DetailPage>
    </Page>
  );
}
