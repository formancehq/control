import * as React from 'react';
import { useState } from 'react';

import { AutoMode, Delete, Share, Visibility } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { first, get, pick } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  ActionZone,
  Chip,
  Date,
  LoadingButton,
  Page,
  Row,
  Secret,
  SectionWrapper,
  theme,
} from '@numaryhq/storybook';

import { getRoute, WEBHOOKS_ROUTE } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import Modal from '~/src/components/Wrappers/Modal';
import Table from '~/src/components/Wrappers/Table';
import WebhookStatus from '~/src/components/Wrappers/WebhookStatus';
import { useService } from '~/src/hooks/useService';
import { Webhook } from '~/src/types/webhook';
import { API_WEBHOOK } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Webhook',
  description: 'Show details',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="webhook"
      title="pages.webhook.title"
      error={error}
      showAction={false}
    />
  );
}
export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.webhookId, 'Expected params.webhookId');
    const webhook = await (
      await createApiClient(session)
    ).getResource<Webhook[]>(
      `${API_WEBHOOK}/configs?id=${params.webhookId}`,
      'cursor.data'
    );

    if (webhook) {
      return first(webhook);
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const data = useLoaderData() as unknown as Webhook;
  const { t } = useTranslation();
  const { api, snackbar } = useService();
  const { webhookId: id } = useParams<{
    webhookId: string;
  }>();
  const navigate = useNavigate();
  const [webhook, setWebhook] = useState<Webhook>(data);
  const [secret, setSecret] = useState<string>(
    '******************************'
  );

  const onDelete = async (id: string, endpoint: string) => {
    let result = undefined;
    try {
      result = await api.deleteResource<unknown>(
        `${API_WEBHOOK}/configs/${id}`
      );
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: `${t('pages.webhook.title')} ${endpoint}`,
        })
      );
    }
    if (result) {
      navigate(getRoute(WEBHOOKS_ROUTE));
    }
  };

  const onRenew = async () => {
    let result = undefined;
    try {
      result = await api.putResource<Webhook[]>(
        `${API_WEBHOOK}/configs/${id}/secret/change`,
        'cursor.data'
      );
    } catch {
      snackbar(
        t('common.feedback.update', {
          item: `${t('pages.webhook.secret')} ${webhook.endpoint}`,
        })
      );
    }
    if (result) {
      const secret = first(result)?.secret;
      if (secret) setSecret(secret);
    }
  };

  const renderRowActions = (webhook: Webhook) => (
    <Box
      component="span"
      key={webhook._id}
      display="inline-flex"
      sx={{ float: 'right' }}
    >
      <LoadingButton
        variant="stroke"
        id="webhook-reveal-secret"
        sx={{ ml: 1 }}
        startIcon={<Visibility />}
        content={t('pages.webhook.sections.secrets.reveal')}
        onClick={() => setSecret(webhook.secret)}
      />
      <LoadingButton
        variant="stroke"
        id="webhook-renew-secret"
        sx={{ ml: 1 }}
        startIcon={<AutoMode />}
        content={t('pages.webhook.sections.secrets.renew')}
        onClick={onRenew}
      />
    </Box>
  );

  return (
    <Page id="webhook" title={t('pages.webhook.title')}>
      <>
        <Box
          mt="26px"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px',
            padding: '0 26px 26px 26px',
            backgroundColor: theme.palette.neutral[0],
          }}
        >
          <SectionWrapper title={t('pages.webhook.sections.details.title')}>
            <>
              {/* Status */}
              <Grid container sx={{ mb: 2, mt: 2 }}>
                <Grid item xs={2}>
                  <Typography variant="bold">
                    {t('pages.webhooks.table.columnLabel.active')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <WebhookStatus
                    webhook={webhook}
                    onChangeCallback={() => {
                      setWebhook({ ...webhook, active: !webhook.active });
                    }}
                  />
                </Grid>
              </Grid>
              {/* Endpoint */}
              <Grid container sx={{ marginBottom: 2 }}>
                <Grid item xs={2}>
                  <Typography variant="bold">
                    {t('pages.webhook.sections.details.endpoint')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Chip
                    label={webhook.endpoint}
                    variant="square"
                    color="blue"
                    icon={<Share fontSize="small" />}
                    sx={{ marginRight: 1 }}
                  />
                </Grid>
              </Grid>
              {/* Events */}
              <Grid container sx={{ mb: 2, mt: 2 }}>
                <Grid item xs={2}>
                  <Typography variant="bold">
                    {t('pages.webhooks.table.columnLabel.eventTypes')}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  {webhook.eventTypes.map((event) => (
                    <Chip
                      key={event}
                      label={event}
                      variant="square"
                      color="yellow"
                      sx={{ marginRight: 1 }}
                    />
                  ))}
                </Grid>
              </Grid>
              {/* Dates */}
              {Object.keys(pick(webhook, ['createdAt', 'modifiedAt'])).map(
                (key: string, index: number) => {
                  const item = get(webhook, key);
                  if (item)
                    return (
                      <Grid container key={index} sx={{ marginBottom: 2 }}>
                        <Grid item xs={2}>
                          <Typography variant="bold">
                            {t(`pages.webhook.sections.details.${key}`)}
                          </Typography>
                        </Grid>
                        <Grid item xs={10}>
                          <Date key={index} timestamp={item} />
                        </Grid>
                      </Grid>
                    );
                }
              )}
            </>
          </SectionWrapper>
          <SectionWrapper title={t('pages.webhook.sections.secrets.title')}>
            <Table
              id="webhook-secrets-list"
              items={[webhook]}
              action
              withPagination={false}
              withHeader={false}
              columns={[]}
              renderItem={(webhook: Webhook, index: number) => (
                <Row
                  key={index}
                  keys={[
                    <Secret
                      value={secret}
                      tooltipMessage={t('common.tooltip.copied')}
                      key={index}
                    />,
                  ]}
                  item={webhook}
                  renderActions={() => renderRowActions(webhook)}
                />
              )}
            />
          </SectionWrapper>
          <SectionWrapper title={t('pages.webhook.sections.dangerZone.title')}>
            <ActionZone
              actions={[
                {
                  key: 'delete-webhook',
                  title: t('pages.webhook.sections.dangerZone.delete.title'),
                  description: t(
                    'pages.webhook.sections.dangerZone.delete.description'
                  ),
                  button: (
                    <Modal
                      button={{
                        id: `delete-${webhook._id}`,
                        startIcon: <Delete />,
                        content: t('common.buttons.delete'),
                        variant: 'error',
                      }}
                      modal={{
                        id: `delete-${webhook._id}-modal`,
                        PaperProps: { sx: { minWidth: '500px' } },
                        title: t('common.dialog.deleteTitle'),
                        actions: {
                          save: {
                            variant: 'error',
                            label: t('common.dialog.confirmButton'),
                            onClick: () =>
                              onDelete(webhook._id, webhook.endpoint),
                          },
                        },
                      }}
                    >
                      <Typography>
                        <Trans
                          i18nKey="common.dialog.messages.confirmDelete"
                          values={{ item: webhook.endpoint }}
                          components={{ bold: <strong /> }}
                        />
                      </Typography>
                    </Modal>
                  ),
                },
              ]}
            />
          </SectionWrapper>
        </Box>
      </>
    </Page>
  );
}
