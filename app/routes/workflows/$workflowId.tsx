import * as React from 'react';

import { Schema } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import ReactFlow, { Controls } from 'reactflow';
import invariant from 'tiny-invariant';

import { Chip, Date, Page, Row, SectionWrapper } from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import InstanceList from '~/src/components/Wrappers/Lists/InstanceList';
import Table from '~/src/components/Wrappers/Table';
import CustomNode from '~/src/components/Wrappers/Workflows/CustomNode';
import ArrowNode from '~/src/components/Wrappers/Workflows/CustomNode/ArrowNode';
import { FlowWorkflow } from '~/src/types/orchestration';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Flow',
  description: 'Show a workflow',
});

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.workflowId, 'Expected params.workflowId');
    const api = await createApiClient(session);
    const workflow = await api.getResource<any>(
      `${API_ORCHESTRATION}/workflows/${params.workflowId}`,
      'data'
    );
    const instances = await api.getResource<any>(
      `${API_ORCHESTRATION}/instances?workflowID=${params.workflowId}`,
      'data'
    );

    return { ...workflow, instances };
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="workflow"
      title="pages.workflow.title"
      error={error}
      showAction={false}
    />
  );
}

const nodeTypes = { customNode: CustomNode, arrowNode: ArrowNode };

export default function Index() {
  const { t } = useTranslation();
  const workflow = useLoaderData<FlowWorkflow>() as unknown as FlowWorkflow;
  let x = 0;
  const displayFlow = workflow.config.stages.length > 0;
  const initPos = workflow.config.stages.length === 1 ? 0 : -200;
  const nodes = workflow.config.stages
    .map((stage: any, index: number) => {
      x = x + index === 0 ? initPos : x + 360;

      const nodes = [
        {
          type: 'customNode',
          id: (index + 1).toString(),
          position: { x, y: 250 },
          style: { width: '200px' },
          data: {
            label: Object.keys(stage)[0],
            details: stage,
          },
        },
      ];

      if (workflow.config.stages.length - 1 !== index) {
        nodes.push({
          type: 'arrowNode',
          draggable: false,
          selectable: false,
          id: `arrow-node-${index}`,
          position: { x: x + 190, y: 250 },
        } as any);
      }

      return nodes;
    })
    .flat();

  const edges = workflow.config.stages.map((stage: any, index: number) => ({
    id: `edge-${index}`,
    source: '0',
    animated: true,
    target: (index + 1).toString(),
  }));

  return (
    <Page
      id="workflow"
      title={
        <Box mb={2}>
          <IconTitlePage icon={<Schema />} title={t('pages.workflow.title')} />
        </Box>
      }
    >
      <>
        <Table
          id="workflow"
          items={[workflow]}
          withPagination={false}
          columns={[]}
          renderItem={(workflow: FlowWorkflow, index: number) => (
            <Row
              key={index}
              keys={[
                <Box
                  component="span"
                  key={index}
                  display="flex"
                  alignItems="center"
                >
                  <Chip
                    label={workflow.config.stages.length}
                    color="violet"
                    sx={{ borderRadius: '50%' }}
                  />
                  <Typography ml={1}>
                    {t('pages.workflow.sections.recap.stages')}
                  </Typography>
                </Box>,
                <Box
                  component="span"
                  key={index}
                  display="flex"
                  alignItems="center"
                >
                  <Chip
                    label={workflow.instances.length}
                    color="violet"
                    sx={{ borderRadius: '50%' }}
                  />
                  <Typography ml={1}>
                    {t('pages.workflow.sections.recap.instances')}
                  </Typography>
                </Box>,
                <Date key={index} timestamp={workflow.createdAt} />,
              ]}
              item={workflow}
            />
          )}
        />
        {displayFlow && (
          <SectionWrapper title={t('pages.workflow.sections.details.title')}>
            <Box sx={{ width: '96%', height: '400px', mb: 10 }}>
              <ReactFlow
                nodes={nodes as any}
                edges={edges}
                fitView
                nodeOrigin={[0.5, 0.5]}
                elementsSelectable={false}
                nodesConnectable={false}
                preventScrolling
                nodeTypes={nodeTypes}
              >
                <Controls showInteractive={false} />
              </ReactFlow>
            </Box>
          </SectionWrapper>
        )}
        <SectionWrapper title={t('pages.workflow.sections.instances.title')}>
          <InstanceList instances={workflow.instances} />
        </SectionWrapper>
      </>
    </Page>
  );
}
