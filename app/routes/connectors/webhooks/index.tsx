import * as React from 'react';
import { useState } from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import Table from '~/src/components/Wrappers/Table';
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
  const data = useLoaderData();
  const [webhooks, _setWebhooks] = useState<Webhook[]>(data);

  return (
    <Box mt={2}>
      <Table
        id="webhooks-list"
        items={webhooks}
        action={false}
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
          />
        )}
      />
    </Box>
  );
}
