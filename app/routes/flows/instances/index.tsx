import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import { INSTANCE_ROUTE } from '~/src/components/Layout/routes';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  orchestrationInstanceStatusColorMap,
  orchestrationInstanceStatusIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import {
  OrchestrationInstance,
  OrchestrationInstanceStatuses,
} from '~/src/types/orchestration';
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
            width: 40,
          },
          {
            key: 'status',
            label: t('pages.instances.table.columnLabel.status'),
            width: 40,
          },
          {
            key: 'createdAt',
            label: t('pages.instances.table.columnLabel.createdAt'),
            width: 20,
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
              <StatusChip
                key={index}
                status={
                  instance.terminated
                    ? OrchestrationInstanceStatuses.TERMINATED
                    : OrchestrationInstanceStatuses.RUNNING
                }
                iconMap={orchestrationInstanceStatusIconMap}
                colorMap={orchestrationInstanceStatusColorMap}
              />,
              <Date key={index} timestamp={instance.createdAt} />,
            ]}
            item={instance}
            renderActions={() => (
              <ShowListAction id={instance.id} route={INSTANCE_ROUTE} />
            )}
          />
        )}
      />
    </Box>
  );
}
