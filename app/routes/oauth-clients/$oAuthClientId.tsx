import * as React from 'react';
import { useState } from 'react';

import { Add, Delete } from '@mui/icons-material';
import { Alert, Box, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import { ColorVariants } from '@numaryhq/storybook/dist/cjs/types/types';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get, pick } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { Chip, Page, Row, SectionWrapper, theme } from '@numaryhq/storybook';

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
  const { api, snackbar } = useService();
  const { oAuthClientId: id } = useParams<{
    oAuthClientId: string;
  }>();
  const [secrets, setSecrets] = useState<OAuthSecret[]>(
    oAuthClient.Secrets.map((secret) => ({ ...secret, clear: undefined }))
  );
  const { typography } = useTheme();
  const [copiedMessage, setCopiedMessage] = useState<string>('');

  const renderUris = (key: string, color?: ColorVariants) => {
    const uris = get(oAuthClient, key, []) || [];

    return (
      <>
        {uris.length > 0 && (
          <Grid container sx={{ mb: 1, mt: 2 }}>
            <Grid item xs={2}>
              <Typography variant="bold">
                {t(`pages.oAuthClient.sections.details.${key}`)}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              {uris.map((uri: string, index: number) => (
                <Chip
                  key={index}
                  label={uri}
                  color={color}
                  variant="square"
                  sx={{ marginRight: 1 }}
                />
              ))}
            </Grid>
          </Grid>
        )}
      </>
    );
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
      const secretList = [...secrets, secret] as OAuthSecret[];
      setSecrets(secretList);
    }
  };

  return (
    <Page id="oAuthClient" title={t('pages.oAuthClient.title')}>
      <Box mt="26px">
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
              <Grid container sx={{ marginBottom: 1 }}>
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
                    color={oAuthClient.public ? 'green' : 'red'}
                  />
                </Grid>
              </Grid>
              {Object.keys(pick(oAuthClient, ['name', 'description'])).map(
                (key: string, index: number) => {
                  const item = get(oAuthClient, key);
                  if (item)
                    return (
                      <Grid container key={index} sx={{ marginBottom: 1 }}>
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
              {renderUris('redirectUris')}
              {renderUris('postLogoutRedirectUris', 'brown')}
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
                              '.MuiAlert-message': {
                                ...typography.body1,
                              },
                            }}
                          >
                            <Box component="span" sx={{ display: 'block' }}>
                              {t('pages.oAuthClient.sections.secrets.clear')}
                            </Box>
                            <Tooltip
                              title={copiedMessage}
                              onClose={() => setCopiedMessage('')}
                            >
                              <Chip
                                onClick={async () => {
                                  await copyTokenToClipboard(
                                    secret.clear || ''
                                  );
                                  setCopiedMessage(t('common.tooltip.copied'));
                                }}
                                sx={{ marginLeft: 1 }}
                                label={secret.clear}
                                color="blue"
                                variant="square"
                              />
                            </Tooltip>
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
