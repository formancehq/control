import * as React from 'react';
import { useEffect } from 'react';

import { Add, DashboardCustomize, PlaylistAdd } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { flattenDeep, get, isEmpty, omit } from 'lodash';
import { useTranslation } from 'react-i18next';
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
import ArrowNode from '~/src/components/Wrappers/Workflows/CustomNode/ArrowNode';
import SequentialNode from '~/src/components/Wrappers/Workflows/CustomNode/SequentialNode';
import {
  logsFactory,
  OrchestrationFactoryLog,
} from '~/src/components/Wrappers/Workflows/logs/factory';
import {
  FlowInstance,
  OrchestrationInstanceStatuses,
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
    const stagesHistory = await api
      .getResource<any>(
        `${API_ORCHESTRATION}/instances/${params.instanceId}/history`,
        'data'
      )
      .catch(() => []);

    const stages = [];
    // There is no history for stage wait_event and delay, so we can hardcode 0 as send stage number
    if (instance.status.length > 0) {
      for (const status of instance.status) {
        const activities = [];
        const stage = {
          ...stagesHistory[status.stage],
          instanceId: status.instanceID,
          id: status.status,
          error: status.error,
        };

        const stageActivities = await api
          .getResource<any>(
            `${API_ORCHESTRATION}/instances/${params.instanceId}/stages/${status.stage}/history`,
            'data'
          )
          .catch();

        if (stageActivities) {
          const activitiesFormatted = stageActivities.map((activity: any) => ({
            ...activity,
            stageId: status.stage,
          }));
          activities.push(activitiesFormatted);
        }
        stages.push({ ...stage, activities: activities.flat() });
      }
    }

    return { ...omit(instance, ['status']), stages } as FlowInstance;
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

const nodeTypes = {
  customNode: CustomNode,
  sequentialNode: SequentialNode,
  arrowNode: ArrowNode,
};

export default function Index() {
  const { t } = useTranslation();
  const instance = useLoaderData<FlowInstance>() as unknown as FlowInstance;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const activities = instance.stages.map((stage) => stage.activities).flat();
  const initPosInstance =
    instance.stages.length === 1 ? 50 * activities.length + 50 : -200;
  const initPosActivity = activities.length === 1 ? 0 : -200;
  let x = 0;
  let j = 0;
  let z = 0;
  let sequentialNodeId = 0;

  const displayFlow = instance.stages.length > 0;
  const logs = logsFactory(activities);
  const stagesNodes = instance.stages
    .map((stage: any, index: number) => {
      x = x + index === 0 ? initPosInstance : x + 400;
      const nodes = [
        {
          type: 'customNode',
          id: `stages-node-${index}`,
          position: { x, y: 100 },
          style: { width: '250px' },
          draggable: false,
          selectable: false,
          data: {
            isHighLevel: stage.activities.length > 0,
            label: stage.name,
            details: stage,
          },
        },
      ];

      if (instance.stages.length - 1 !== index) {
        nodes.push({
          type: 'arrowNode',
          draggable: false,
          selectable: false,
          id: `arrow-node-${index}`,
          position: { x: x + 210, y: 100 },
        } as any);
      }

      return nodes;
    })
    .flat();

  const activitiesNodes = activities.map((activity: any, index: number) => {
    j = j + index === 0 ? initPosActivity : j + 300;
    const output = get(activity, 'output');
    const input = get(activity, 'input');

    return {
      type: 'customNode',
      id: `activities-node-${index}`,
      position: { x: j, y: 430 },
      style: { width: '250px' },
      data: {
        isLowLevel: true,
        label: activity.name,
        details: { input, output },
      },
    };
  });

  const sequentialNodes = flattenDeep(
    instance.stages.map((stage: any) => {
      const n = [] as any[];
      stage.activities.forEach((_activity: any, index: number) => {
        z = z + index === 0 ? initPosActivity : z + 300;
        n.push({
          type: 'sequentialNode',
          id: `seq-node-${sequentialNodeId}`,
          position: { x: z, y: 350 },
          data: {
            label: index + 1,
          },
        });
        sequentialNodeId++;
      });

      return n as any[];
    })
  );

  const edgeStages = activities.map((activity: any, index: number) => ({
    id: `stages-edge-${index}`,
    source: `stages-node-${activity.stageId}`,
    target: `seq-node-${index}`,
  }));

  const edgeActivities = activities.map((_activity: any, index: number) => ({
    id: `activities-edge-${index}`,
    source: `seq-node-${index}`,
    animated: true,
    target: `activities-node-${index}`,
  }));

  useEffect(() => {
    setNodes([...stagesNodes, ...sequentialNodes, ...activitiesNodes] as any);
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
                    label={activities.length}
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
          {displayFlow ? (
            <Box
              sx={{
                width: '96%',
                height: '500px',
                mb: 10,
              }}
            >
              <ReactFlow
                nodes={nodes}
                edges={[...edgeStages, ...edgeActivities]}
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
          ) : (
            <Typography variant="placeholder">
              {t('common.noActivity')}
            </Typography>
          )}
        </SectionWrapper>
        {logs.length > 0 && (
          <SectionWrapper title={t('pages.instance.sections.logs.title')}>
            <ShellViewer copy={false} scroll>
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
