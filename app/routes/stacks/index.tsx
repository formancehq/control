import * as React from 'react';

import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';

import { Chip, Page, Row, SectionWrapper } from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import Table from '~/src/components/Wrappers/Table';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Stacks',
  description: 'List all stacks',
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(
      session,
      `${process.env.MEMBERSHIP_URL}/api`,
      true
    );
    const organizations = await api.getResource<any>('/organizations');
    const stacks = [];
    for (const organization of organizations.data) {
      const organizationStacks = await api.getResource<any>(
        `/organizations/${organization.id}/stacks`
      );
      stacks.push(organizationStacks.data);
    }

    return stacks.flat();
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="stacks"
      title="pages.stacks.title"
      error={error}
    />
  );
}

export default function Index() {
  const stacks = useLoaderData<any>();

  return (
    <Page id="stacks">
      <SectionWrapper>
        <Table
          items={stacks}
          withPagination={false}
          columns={[
            {
              key: 'id',
              label: 'ID',
              width: 10,
            },
            {
              key: 'name',
              label: 'Name',
              width: 10,
            },
            {
              key: 'organization',
              label: 'Organization ID',
              width: 10,
            },
            {
              key: 'url',
              label: 'URL',
              width: 50,
            },
            {
              key: 'env',
              label: 'Environment',
              width: 20,
            },
          ]}
          renderItem={(item: any, index) => (
            <Row
              key={index}
              keys={[
                <Chip
                  key={index}
                  label={item.id}
                  variant="square"
                  color="blue"
                />,
                'name',
                <Chip
                  key={index}
                  label={item.organizationId}
                  variant="square"
                  color="brown"
                />,
                <Chip key={index} label={item.uri} variant="square" />,
                <Chip
                  key={index}
                  label={item.production ? 'production' : 'staging'}
                  variant="square"
                  color={item.production ? 'red' : 'yellow'}
                />,
              ]}
              item={item}
            />
          )}
        />
      </SectionWrapper>
    </Page>
  );
}
