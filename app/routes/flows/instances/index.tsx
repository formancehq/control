import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import Table from '~/src/components/Wrappers/Table';
import { OrchestrationInstance } from '~/src/types/orchestration';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Flows',
  description: 'Instance list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const instances = await (
      await createApiClient(session)
    ).getResource<OrchestrationInstance[]>(
      `${API_ORCHESTRATION}/instances`,
      'data'
    );

    if (instances) {
      return instances;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const instances = useLoaderData<OrchestrationInstance>();

  return (
    <Box mt={2}>
      <Table
        id="instance-list"
        items={instances}
        action={true}
        withPagination={false}
        columns={[
          {
            key: 'id',
            label: t('pages.instances.table.columnLabel.id'),
          },
          {
            key: 'workflowID',
            label: t('pages.instances.table.columnLabel.workflowID'),
          },
          {
            key: 'createdAt',
            label: t('pages.instances.table.columnLabel.createdAt'),
          },
          {
            key: 'terminatedAt',
            label: t('pages.instances.table.columnLabel.terminatedAt'),
          },
        ]}
        renderItem={(instance: OrchestrationInstance, index: number) => (
          <Row
            key={index}
            keys={[
              <Chip
                key={index}
                label={instance.id}
                variant="square"
                color="yellow"
              />,
              <Chip
                key={index}
                label={instance.workflowID}
                variant="square"
                color="blue"
              />,
              <Date key={index} timestamp={instance.createdAt} />,
              <Date key={index} timestamp={instance.terminatedAt} />,
            ]}
            item={instance}
          />
        )}
      />
    </Box>
  );
}
