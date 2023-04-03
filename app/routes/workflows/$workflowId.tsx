import * as React from 'react';

import { DashboardCustomize, Schema } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { Controls } from 'reactflow';
import invariant from 'tiny-invariant';

import { Page, SectionWrapper, StatsCard } from '@numaryhq/storybook';

import { getRoute, INSTANCE_ROUTE } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import CustomNode from '~/src/components/Wrappers/Workflows/CustomNode';
import RootNode from '~/src/components/Wrappers/Workflows/CustomNode/RootNode';
import { OrchestrationInstance } from '~/src/types/orchestration';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { formatDate } from '~/src/utils/format';

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

const nodeTypes = { customNode: CustomNode, rootNode: RootNode };

export default function Index() {
  const { t } = useTranslation();
  const workflow = useLoaderData(); // TODO type
  const navigate = useNavigate();
  let x = 0;
  const initPos = workflow.config.stages.length === 1 ? 0 : -200;
  const initialNodes = workflow.config.stages.map(
    (stage: any, index: number) => {
      x = x + index === 0 ? initPos : x + 250;

      return {
        type: 'customNode',
        id: (index + 1).toString(),
        position: { x, y: 250 },
        style: { width: '200px' },
        data: {
          label: Object.keys(stage)[0],
          details: stage,
          isLowLevel: true,
        },
      };
    }
  );

  const init = [
    {
      id: '0',
      type: 'rootNode',
      position: { x: 0, y: 50 },
    },
    ...initialNodes,
  ];

  const initialEdges = workflow.config.stages.map(
    (stage: any, index: number) => ({
      id: `edge-${index}`,
      source: '0',
      animated: true,
      target: (index + 1).toString(),
    })
  );

  return (
    <Page
      id="workflow"
      title={
        <IconTitlePage icon={<Schema />} title={t('pages.workflow.title')} />
      }
    >
      <>
        <SectionWrapper title={t('pages.workflow.sections.details.title')}>
          <Box sx={{ width: '96%', height: '400px', mb: 10 }}>
            <ReactFlow
              nodes={init}
              edges={initialEdges}
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
        <SectionWrapper title={t('pages.workflow.sections.instances.title')}>
          <Box
            mt={3}
            display="flex"
            flexWrap="wrap"
            data-testid="stats-card"
            justifyContent="flex-start"
            gap="26px"
          >
            {workflow.instances.map((instance: OrchestrationInstance) => (
              <Box
                key={instance.id}
                onClick={() => navigate(getRoute(INSTANCE_ROUTE, instance.id))}
                sx={{
                  ':hover': {
                    opacity: 0.3,
                    cursor: 'pointer',
                  },
                }}
              >
                <StatsCard
                  icon={<DashboardCustomize />}
                  variant="violet"
                  type="light"
                  title1={t('pages.workflow.sections.instances.createdAt')}
                  title2={t('pages.workflow.sections.instances.updatedAt')}
                  chipValue={
                    instance.terminated
                      ? t('pages.workflow.sections.instances.terminated')
                      : t('pages.workflow.sections.instances.running')
                  }
                  value1={formatDate(instance.createdAt)}
                  value2={formatDate(instance.updatedAt)}
                />
              </Box>
            ))}
          </Box>
        </SectionWrapper>
      </>
    </Page>
  );
}
