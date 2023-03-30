import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import { WORKFLOW_ROUTE } from '~/src/components/Layout/routes';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import Table from '~/src/components/Wrappers/Table';
import { OrchestrationWorkflow } from '~/src/types/orchestration';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Flows',
  description: 'Workflow list',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const workflows = await (
      await createApiClient(session)
    ).getResource<OrchestrationWorkflow<any>[]>(
      `${API_ORCHESTRATION}/workflows`,
      'data'
    );

    if (workflows) {
      return workflows;
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const workflows = useLoaderData<OrchestrationWorkflow<any>[]>();

  return (
    <Box mt={2}>
      <Table
        id="workflow-list"
        items={workflows}
        action={true}
        withPagination={false}
        columns={[
          {
            key: 'id',
            label: t('pages.workflows.table.columnLabel.id'),
          },
          {
            key: 'name',
            label: t('pages.workflows.table.columnLabel.name'),
          },
          {
            key: 'createdAt',
            label: t('pages.workflows.table.columnLabel.createdAt'),
          },
        ]}
        renderItem={(workflow: OrchestrationWorkflow<any>, index: number) => (
          <Row
            key={index}
            keys={[
              <Chip
                key={index}
                label={workflow.id}
                variant="square"
                color="yellow"
              />,
              'name',
              <Date key={index} timestamp={workflow.createdAt} />,
            ]}
            item={workflow}
            renderActions={() => (
              <ShowListAction id={workflow.id} route={WORKFLOW_ROUTE} />
            )}
          />
        )}
      />
    </Box>
  );
}
