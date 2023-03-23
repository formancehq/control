import * as React from 'react';

import { DashboardCustomize } from '@mui/icons-material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import { Page, SectionWrapper } from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import IconTitlePage from '~/src/components/Wrappers/IconTitlePage';
import { API_ORCHESTRATION } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Flow',
  description: 'Show a workflow instance',
});

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.instanceId, 'Expected params.instanceId');
    const api = await createApiClient(session);
    const instance = await api.getResource<any>(
      `${API_ORCHESTRATION}/instances/${params.instanceId}`,
      'data'
    );
    const instanceHistory = await api.getResource<any>(
      `${API_ORCHESTRATION}/instances/${params.instanceId}/history`,
      'data'
    );

    // There is no history for stage wait_event and delay, so we can hardcode 0 as send stage number
    const stageHistory =
      instance.status.length > 0
        ? await api.getResource<any>(
            `${API_ORCHESTRATION}/instances/${params.instanceId}/stages/0/history`,
            'data'
          )
        : [];

    return { ...instance, instanceHistory, stageHistory };
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

export default function Index() {
  const { t } = useTranslation();
  const instance = useLoaderData(); // TODO type
  console.log(instance);

  return (
    <Page
      id="instance"
      title={
        <IconTitlePage
          icon={<DashboardCustomize />}
          title={t('pages.instance.title')}
        />
      }
    >
      <>
        <SectionWrapper title={t('pages.instance.sections.details.title')}>
          <div>test</div>
        </SectionWrapper>
      </>
    </Page>
  );
}
