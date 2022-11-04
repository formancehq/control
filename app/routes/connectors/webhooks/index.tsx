import * as React from 'react';
import { useState } from 'react';

import { Delete } from '@mui/icons-material';
import { Box, Switch, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Trans, useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import Modal from '~/src/components/Wrappers/Modal';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import { Cursor } from '~/src/types/generic';
import { Webhook } from '~/src/types/webhook';
import { API_WEBHOOK } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Webhooks',
  description: 'List',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    // TODO handle pagination when backend is ready
    const webhooks = await (
      await createApiClient(session)
    ).getResource<Cursor<Webhook>>(`${API_WEBHOOK}/configs`, 'cursor');

    if (webhooks) {
      return webhooks;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const cursor = useLoaderData() as unknown as Cursor<Webhook>;
  const { api, snackbar } = useService();
  const [webhooks, setWebhooks] = useState<Webhook[]>(cursor.data);

  const onStatusChange = async (
    id: string,
    active: boolean,
    endpoint: string
  ) => {
    let result = undefined;
    const route = active ? 'activate' : 'deactivate';
    try {
      result = await api.putResource<unknown>(
        `${API_WEBHOOK}/configs/${id}/${route}`
      );
    } catch {
      snackbar(
        t('common.feedback.update', {
          item: `${t('pages.webhook.title')} ${endpoint}`,
        })
      );
    }
    if (result) {
      setWebhooks(
        webhooks.map((webhook) => {
          if (webhook._id === id) {
            return {
              ...webhook,
              active,
            };
          }

          return webhook;
        })
      );
    }
  };
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
      setWebhooks(webhooks.filter((webhook) => webhook._id !== id));
    }
  };

  const renderRowActions = (webhook: Webhook) => (
    <Box component="span" key={webhook._id} display="inline-flex">
      <Switch
        checked={webhook.active}
        color="default"
        inputProps={{ 'aria-label': 'controlled' }}
        onChange={() =>
          onStatusChange(webhook._id, !webhook.active, webhook.endpoint)
        }
      />
      <Modal
        button={{
          id: `delete-${webhook._id}`,
          startIcon: <Delete />,
        }}
        modal={{
          id: `delete-${webhook._id}-modal`,
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.deleteTitle'),
          actions: {
            save: {
              variant: 'error',
              label: t('common.dialog.confirmButton'),
              onClick: () => onDelete(webhook._id, webhook.endpoint),
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
    </Box>
  );

  return (
    <Box mt={2}>
      <Table
        id="webhooks-list"
        items={webhooks}
        action
        withPagination={false}
        columns={[
          {
            key: 'endpoint',
            label: t('pages.webhooks.table.columnLabel.endpoint'),
          },
          {
            key: 'eventTypes',
            label: t('pages.webhooks.table.columnLabel.eventTypes'),
          },
          {
            key: 'active',
            label: t('pages.webhooks.table.columnLabel.active'),
          },
          {
            key: 'createdAt',
            label: t('pages.webhooks.table.columnLabel.createdAt'),
          },
        ]}
        renderItem={(webhook: Webhook, index: number) => (
          <Row
            key={index}
            keys={[
              'endpoint',
              <Box component="span" key={index}>
                {webhook.eventTypes.map((event, key: number) => (
                  <Chip
                    key={key}
                    label={event}
                    variant="square"
                    color="yellow"
                    sx={{ mr: 1 }}
                  />
                ))}
              </Box>,
              <Chip
                key={index}
                label={t(
                  `pages.webhooks.table.rows.${
                    webhook.active ? 'active' : 'off'
                  }`
                )}
                variant="square"
                color={webhook.active ? 'green' : 'red'}
              />,
              <Date key={index} timestamp={webhook.createdAt} />,
            ]}
            item={webhook}
            renderActions={() => renderRowActions(webhook)}
          />
        )}
      />
    </Box>
  );
}
