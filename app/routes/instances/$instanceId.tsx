import * as React from 'react';
import { useEffect } from 'react';

import { Add, DashboardCustomize, PlaylistAdd } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { get, isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { Controls, useNodesState } from 'reactflow';
import invariant from 'tiny-invariant';

import {
  Chip,
  Page,
  Row,
  SectionWrapper,
  ShellViewer,
} from '@numaryhq/storybook';

import { getRoute, WORKFLOW_ROUTE } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  orchestrationInstanceStatusColorMap,
  orchestrationInstanceStatusIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import CustomNode from '~/src/components/Wrappers/Workflows/CustomNode';
import {
  logsFactory,
  OrchestrationFactoryLog,
} from '~/src/components/Wrappers/Workflows/logs/factory';
import {
  FlowInstance,
  OrchestrationInstanceStatuses,
  OrchestrationRunHistories,
} from '~/src/types/orchestration';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Flow',
  description: 'Show a workflow instance',
});

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<TypedResponse<FlowInstance>> => {
  async function handleData(session: Session) {
    invariant(params.instanceId, 'Expected params.instanceId');
    const api = await createApiClient(session);
    const instance = await api.getResource<any>(
      `${API_ORCHESTRATION}/instances/${params.instanceId}`,
      'data'
    );
    const stages = await api.getResource<any>(
      `${API_ORCHESTRATION}/instances/${params.instanceId}/history`,
      'data'
    );

    // There is no history for stage wait_event and delay, so we can hardcode 0 as send stage number
    const activities =
      instance.status.length > 0
        ? await api.getResource<any>(
            `${API_ORCHESTRATION}/instances/${params.instanceId}/stages/0/history`,
            'data'
          )
        : [];

    return { ...instance, stages, activities } as FlowInstance;
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="instance"
      title="pages.instance.title"
      error={error}
      showAction={false}
    />
  );
}

const nodeTypes = { customNode: CustomNode };

export default function Index() {
  const { t } = useTranslation();
  const instance = useLoaderData<FlowInstance>() as unknown as FlowInstance;
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const initPosInstance =
    instance.stages.length === 1 ? 50 * instance.activities.length + 50 : -200;
  const initPosActivity = instance.activities.length === 1 ? 0 : -200;
  let x = 0;
  let j = 0;

  const logs = logsFactory(instance.activities);
  const stagesNodes = instance.stages.map((history: any, index: number) => {
    x = x + index === 0 ? initPosInstance : x + 300;

    return {
      type: 'customNode',
      id: `stages-node-${index}`,
      position: { x, y: 100 },
      style: { width: '250px' },
      data: {
        isHighLevel: history.name === OrchestrationRunHistories.RUN_SEND,
        label: history.name,
        details: history,
      },
    };
  });

  const activitiesNodes = instance.activities.map(
    (history: any, index: number) => {
      j = j + index === 0 ? initPosActivity : j + 300;
      const output = get(history, 'output');
      const input = get(history, 'input');

      return {
        type: 'customNode',
        id: `activities-node-${index}`,
        position: { x: j, y: 400 },
        style: { width: '250px' },
        data: {
          isLowLevel: true,
          label: history.name,
          details: { input, output },
        },
      };
    }
  );

  const edges = instance.activities.map((history: any, index: number) => ({
    id: `activities-edge-${index}`,
    source: `stages-node-0`,
    animated: true,
    target: `activities-node-${index}`,
  }));

  useEffect(() => {
    setNodes([...stagesNodes, ...activitiesNodes]);
  }, []);

  return (
    <Page
      id="instance"
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            width: '100%',
          }}
        >
          <IconTitlePage
            icon={<DashboardCustomize />}
            title={t('pages.instance.title')}
          />
          <StatusChip
            status={
              instance.terminated
                ? OrchestrationInstanceStatuses.TERMINATED
                : OrchestrationInstanceStatuses.RUNNING
            }
            iconMap={orchestrationInstanceStatusIconMap}
            colorMap={orchestrationInstanceStatusColorMap}
          />
        </Box>
      }
    >
      <>
        <Table
          id="instance"
          items={[instance]}
          withPagination={false}
          columns={[]}
          renderItem={(instance: FlowInstance, index: number) => (
            <Row
              key={index}
              keys={[
                <RoutingChip
                  key={index}
                  label={t('pages.instance.sections.recap.workflow', {
                    id: instance.workflowID,
                  })}
                  route={getRoute(WORKFLOW_ROUTE, instance.workflowID)}
                />,
                <Box
                  component="span"
                  key={index}
                  display="flex"
                  alignItems="center"
                >
                  <Chip
                    label={instance.stages.length}
                    color="violet"
                    sx={{ borderRadius: '50%' }}
                  />
                  <Typography ml={1}>
                    {t('pages.instance.sections.recap.stages')}
                  </Typography>
                </Box>,
                <Box
                  component="span"
                  key={index}
                  display="flex"
                  alignItems="center"
                >
                  <Chip
                    label={instance.activities.length}
                    color="violet"
                    sx={{ borderRadius: '50%' }}
                  />
                  <Typography ml={1}>
                    {t('pages.instance.sections.recap.activities')}
                  </Typography>
                </Box>,
                <Chip
                  key={index}
                  label={
                    isEmpty(instance.error)
                      ? t('pages.instance.sections.recap.noError')
                      : t('pages.instance.sections.recap.error', {
                          error: instance.error,
                        })
                  }
                  color={isEmpty(instance.error) ? 'blue' : 'red'}
                  variant="square"
                />,
              ]}
              item={instance}
            />
          )}
        />
        <SectionWrapper title={t('pages.instance.sections.details.title')}>
          <Box
            sx={{
              width: '96%',
              height: '500px',
              mb: 10,
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              onNodesChange={onNodesChange}
              elementsSelectable={false}
              nodesConnectable={false}
              preventScrolling
              nodeOrigin={[0.5, 0.5]}
              nodeTypes={nodeTypes}
            >
              <Controls showInteractive={false} />
            </ReactFlow>
          </Box>
        </SectionWrapper>
        {logs.length > 0 && (
          <SectionWrapper title={t('pages.instance.sections.logs.title')}>
            <ShellViewer copy={false}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {logs.map((log: OrchestrationFactoryLog, index: number) => (
                  <Box display="flex" flexDirection="column" key={index}>
                    <Typography
                      variant="money"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <PlaylistAdd />
                      {log.main}
                    </Typography>
                    {log.children &&
                      log.children.map((child: string, index: number) => (
                        <Typography
                          key={index}
                          variant="money"
                          color="secondary"
                          ml={3}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Add fontSize="small" />
                          {child}
                        </Typography>
                      ))}
                  </Box>
                ))}
              </Box>
            </ShellViewer>
          </SectionWrapper>
        )}
      </>
    </Page>
  );
}
