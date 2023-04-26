import * as React from 'react';
import { useEffect, useState } from 'react';

import {
  Add,
  DashboardCustomize,
  PlaylistAdd,
  Redo,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, TypedResponse } from '@remix-run/server-runtime';
import { isEmpty, omit } from 'lodash';
import { useTranslation } from 'react-i18next';
import ReactFlow, { ControlButton, Controls, useNodesState } from 'reactflow';
import invariant from 'tiny-invariant';

import {
  Chip,
  Page,
  Row,
  SectionWrapper,
  ShellViewer,
} from '@numaryhq/storybook';

import { getRoute, WORKFLOW_ROUTE } from '~/src/components/Layout/routes';
import CustomNode from '~/src/components/Workflows/CustomNode';
import ArrowNode from '~/src/components/Workflows/CustomNode/ArrowNode';
import ActivitiesWrapper from '~/src/components/Workflows/histories/activities/ActivitiesWrapper';
import {
  logsFactory,
  OrchestrationFactoryLog,
} from '~/src/components/Workflows/logs/factory';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  orchestrationInstanceStatusColorMap,
  orchestrationInstanceStatusIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
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
          .catch(() => []);

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
  activitiesWrapperNode: ActivitiesWrapper,
  arrowNode: ArrowNode,
};

export default function Index() {
  const { t } = useTranslation();
  const rawInstance = useLoaderData<FlowInstance>() as unknown as FlowInstance;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [next, setNext] = useState(5);
  const [showPaginationLabel, setShowPaginationLabel] = useState(false);
  let x = 0;
  const instance = {
    ...rawInstance,
    stages: rawInstance.stages.slice(0, next),
  };
  const displayFlow = rawInstance.stages.length > 0;
  const activities = instance.stages.map((stage) => stage.activities).flat();
  const activitiesCount = rawInstance.stages
    .map((stage) => stage.activities)
    .flat().length;
  const initPosInstance =
    instance.stages.length === 1 ? 50 * activities.length + 50 : -200;
  const logs = logsFactory(activities);

  const stagesNodes = instance.stages
    .map((stage: any, index: number) => {
      x = x + index === 0 ? initPosInstance : x + 350;
      if (isEmpty(stage.error) && stage.name) {
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
            position: { x: x + 185, y: 100 },
          } as any);
        }
        if (stage.activities.length > 0) {
          nodes.push({
            type: 'activitiesWrapperNode',
            id: `activities-wrapper-node-${index}`,
            position: { x, y: 500 },
            style: { width: '300px' },
            data: {
              details: stage,
            },
          } as any);
        }

        return nodes;
      }

      return [];
    })
    .flat();

  const edges = instance.stages.map((stage: any, index: number) => ({
    id: `stages-edge-${index}`,
    source: `stages-node-${index}`,
    animated: true,
    target: `activities-wrapper-node-${index}`,
  }));

  useEffect(() => {
    setNodes(stagesNodes as any);
  }, [next]);

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
                    label={rawInstance.stages.length}
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
                    label={activitiesCount}
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
          {displayFlow && nodes.length > 0 ? (
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
                onPaneClick={() => {
                  setNext(next + 1);
                }}
              >
                <Controls showInteractive={false}>
                  <ControlButton
                    onClick={() => setNext(next + 1)}
                    onMouseEnter={() => setShowPaginationLabel(true)}
                    onMouseLeave={() => setShowPaginationLabel(false)}
                    title={t('pages.instance.sections.flow.showMore')}
                    disabled={next === rawInstance.stages.length}
                  >
                    <Box sx={{ transition: 'all 0.5s', width: 'auto' }}>
                      {!showPaginationLabel ? (
                        <Redo />
                      ) : (
                        t('pages.instance.sections.flow.showing', {
                          current: next,
                          total: rawInstance.stages.length,
                        })
                      )}
                    </Box>
                  </ControlButton>
                </Controls>
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
