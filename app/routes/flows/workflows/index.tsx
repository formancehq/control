import * as React from 'react';

import { MoreHoriz } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Chip, Date, Row } from '@numaryhq/storybook';

import {
  WORKFLOW_ROUTE,
  workflows as workflowsConfig,
} from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import { orchestrationStagesIconMap } from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import { FEATURES } from '~/src/contexts/service';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
import { OrchestrationWorkflow } from '~/src/types/orchestration';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Flows',
  description: 'Workflow list',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={workflowsConfig.id}
      title="pages.workflows.title"
      error={error}
    />
  );
}

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
  useFeatureFlag(FEATURES.WORKFLOWS);

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
            width: 10,
          },
          {
            key: 'name',
            label: t('pages.workflows.table.columnLabel.name'),
            width: 40,
          },
          {
            key: 'stage',
            label: t('pages.workflows.table.columnLabel.stages'),
            width: 40,
          },
          {
            key: 'createdAt',
            label: t('pages.workflows.table.columnLabel.createdAt'),
            width: 10,
          },
        ]}
        renderItem={(workflow: OrchestrationWorkflow<any>, index: number) => {
          const stages =
            workflow.config.stages.length > 10
              ? workflow.config.stages.slice(0, 10)
              : workflow.config.stages;

          return (
            <Row
              key={index}
              keys={[
                <Chip
                  key={index}
                  label={workflow.id}
                  variant="square"
                  color="yellow"
                />,
                workflow.name ? (
                  'name'
                ) : (
                  <Typography variant="placeholder">
                    {t('pages.workflows.table.noName')}
                  </Typography>
                ),
                <Box
                  key={index}
                  component="span"
                  display="flex"
                  flexDirection="column"
                >
                  <Box component="span">
                    <Chip
                      key={index}
                      label={workflow.config.stages.length}
                      color="blue"
                      sx={{ borderRadius: '50%' }}
                    />
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      mt: 0.5,
                      '& .MuiSvgIcon-root': {
                        color: ({ palette }) => palette.neutral[300],
                      },
                    }}
                  >
                    <>
                      {stages.map((stage) =>
                        get(orchestrationStagesIconMap, Object.keys(stage)[0])
                      )}
                      {workflow.config.stages.length > 10 && <MoreHoriz />}
                    </>
                  </Box>
                </Box>,
                <Date key={index} timestamp={workflow.createdAt} />,
              ]}
              item={workflow}
              renderActions={() => (
                <ShowListAction id={workflow.id} route={WORKFLOW_ROUTE} />
              )}
            />
          );
        }}
      />
    </Box>
  );
}
