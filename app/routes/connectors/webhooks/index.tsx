import * as React from 'react';
import { useState } from 'react';

import { ArrowRight, Share } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Chip, Date, LoadingButton, Row } from '@numaryhq/storybook';

import { getRoute, WEBHOOK_ROUTE } from '~/src/components/Navbar/routes';
import Table from '~/src/components/Wrappers/Table';
import WebhookStatus from '~/src/components/Wrappers/WebhookStatus';
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
  const [webhooks, setWebhooks] = useState<Webhook[]>(cursor.data);
  const navigate = useNavigate();

  const renderRowActions = (webhook: Webhook) => (
    <LoadingButton
      id={`show-${webhook._id}`}
      onClick={() => navigate(getRoute(WEBHOOK_ROUTE, webhook._id))}
      endIcon={<ArrowRight />}
      sx={{ float: 'right' }}
    />
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
            width: 20,
          },
          {
            key: 'eventTypes',
            label: t('pages.webhooks.table.columnLabel.eventTypes'),
            width: 60,
          },
          {
            key: 'active',
            label: t('pages.webhooks.table.columnLabel.active'),
            width: 10,
          },
          {
            key: 'createdAt',
            label: t('pages.webhooks.table.columnLabel.createdAt'),
            width: 10,
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
                <Share fontSize="small" />
                <Typography ml={1}>{webhook.endpoint}</Typography>
              </Box>,
              <Box
                component="span"
                key={index}
                display="flex"
                gap="16px"
                flexWrap="wrap"
              >
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
              <WebhookStatus
                key={index}
                webhook={webhook}
                onChangeCallback={() => {
                  setWebhooks(
                    webhooks.map((wb) => {
                      if (wb._id === webhook._id) {
                        return {
                          ...wb,
                          active: !wb.active,
                        };
                      }

                      return wb;
                    })
                  );
                }}
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
