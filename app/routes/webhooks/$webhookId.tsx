import * as React from 'react';
import { useState } from 'react';

import { Share } from '@mui/icons-material';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { first, get, pick } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  Chip,
  Date,
  LoadingButton,
  Page,
  Row,
  SectionWrapper,
  theme,
} from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import { Webhook } from '~/src/types/webhook';
import { API_WEBHOOK } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { copyTokenToClipboard } from '~/src/utils/clipboard';

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
  const webhook = useLoaderData() as unknown as Webhook;
  const { t } = useTranslation();
  const { api, snackbar } = useService();
  const { webhookId: id } = useParams<{
    webhookId: string;
  }>();
  const [copiedMessage, setCopiedMessage] = useState<string>('');
  const [secret, setSecret] = useState<string>(
    '******************************'
  );

  const renderRowActions = (webhook: Webhook) => (
    <Box component="span" key={webhook._id} display="inline-flex">
      <LoadingButton
        variant="stroke"
        id="webhook-reveal-secret"
        sx={{ ml: 1 }}
        content={t('pages.webhook.sections.secrets.reveal')}
        onClick={() => setSecret(webhook.secret)}
      />
      <LoadingButton
        variant="primary"
        id="webhook-renew-secret"
        sx={{ ml: 1 }}
        content={t('pages.webhook.sections.secrets.renew')}
        onClick={() => setSecret(webhook.secret)}
      />
    </Box>
  );

  return (
    <Page id="webhook" title={t('pages.webhook.title')}>
      <Box mt="26px">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
                  <Chip
                    label={t(
                      `pages.webhooks.table.rows.${
                        webhook.active ? 'active' : 'off'
                      }`
                    )}
                    variant="square"
                    color={webhook.active ? 'green' : 'red'}
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
                  <Tooltip
                    title={copiedMessage}
                    onClose={() => setCopiedMessage('')}
                  >
                    <Chip
                      label={webhook.endpoint}
                      variant="square"
                      color="blue"
                      icon={<Share fontSize="small" />}
                      onClick={async () => {
                        await copyTokenToClipboard(webhook.endpoint);
                        setCopiedMessage(t('common.tooltip.copied'));
                      }}
                      sx={{ marginRight: 1 }}
                    />
                  </Tooltip>
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
            <Box mt={2}>
              <Table
                id="webhook-secrets-list"
                items={[webhook]}
                action
                withPagination={false}
                withHeader={false}
                columns={[
                  {
                    key: 'secret',
                    label: '',
                    width: 80,
                  },
                ]}
                renderItem={(webhook: Webhook, index: number) => (
                  <Row
                    key={index}
                    keys={[
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        key={index}
                      >
                        <Tooltip
                          title={copiedMessage}
                          onClick={async () => {
                            await copyTokenToClipboard(secret);
                            setCopiedMessage(t('common.tooltip.copied'));
                          }}
                          onClose={() => setCopiedMessage('')}
                        >
                          <Chip key={index} label={secret} variant="square" />
                        </Tooltip>
                      </Box>,
                    ]}
                    item={webhook}
                    renderActions={() => renderRowActions(webhook)}
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
