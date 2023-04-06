import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';

import InstanceList from '~/src/components/Wrappers/Lists/InstanceList';
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
  const instances = useLoaderData<
    OrchestrationInstance[]
  >() as unknown as OrchestrationInstance[];

  return (
    <Box mt={2}>
      <InstanceList instances={instances} />
    </Box>
  );
}
