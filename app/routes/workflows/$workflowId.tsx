import * as React from 'react';

import { Wallet as WalletIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import ReactFlow, { Controls } from 'reactflow';
import invariant from 'tiny-invariant';

import { Page, SectionWrapper } from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import CustomNode from '~/src/components/Wrappers/Workflows/CustomNode';
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

    return await (
      await createApiClient(session)
    ).getResource<any>(
      `${API_ORCHESTRATION}/workflows/${params.workflowId}`,
      'data'
    );
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

const nodeTypes = { customNode: CustomNode };

export default function Index() {
  const { t } = useTranslation();
  const workflow = useLoaderData(); // TODO type
  let x = 0;
  const initialNodes = workflow.config.stages.map(
    (stage: any, index: number) => {
      x = x + index === 0 ? 0 : x + 200;

      return {
        type: 'customNode',
        id: (index + 1).toString(),
        position: { x, y: 250 },
        data: { label: Object.keys(stage)[0], details: stage },
      };
    }
  );

  const init = [
    {
      id: '0',
      position: { x: 0, y: 50 },
      data: { label: workflow.config.name || 'Default workflow' },
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
        <IconTitlePage
          icon={<WalletIcon />}
          title={t('pages.workflow.title')}
        />
      }
    >
      <>
        <SectionWrapper title={t('pages.workflow.sections.details.title')}>
          <Box sx={{ width: '96%', height: '500px' }}>
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
      </>
    </Page>
  );
}
