import * as React from 'react';

import { Grid, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';

import {
  Chip,
  CopyPasteTooltip,
  Page,
  Row,
  SectionWrapper,
} from '@numaryhq/storybook';

import { accounts as accountsConfig } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  gatewayServicesColorMap,
  gatewayServicesIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import { FEATURES } from '~/src/contexts/service';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
import { useService } from '~/src/hooks/useService';
import {
  Gateway,
  GatewayServiceStatus,
  GatewayVersion,
} from '~/src/types/gateway';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

export const meta: MetaFunction = () => ({
  title: 'Status',
  description: "Show stack's component status list",
});

export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    return await (
      await createApiClient(session, process.env.API_URL)
    ).getResource<Gateway>('/versions');
  }

  return handleResponse(await withSession(request, handleData));
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={accountsConfig.id}
      title="pages.accounts.title"
      error={error}
    />
  );
}

export default function Index() {
  const gateway = useLoaderData<Gateway>();
  const { t } = useTranslation();
  const { metas } = useService();
  const id = metas.api.split('.')[0].split('//')[1];
  useFeatureFlag(FEATURES.STATUS);

  return (
    <Page id="status">
      <>
        <SectionWrapper title={t('pages.status.sections.details.title')}>
          <>
            {/* ID */}
            <Grid container sx={{ mb: 1, mt: 2 }}>
              <Grid item xs={2}>
                <Typography variant="bold">
                  {t('pages.status.sections.details.id')}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <CopyPasteTooltip
                  tooltipMessage={t('common.tooltip.copied')}
                  value={id}
                >
                  <Chip variant="square" label={id} color="brown" />
                </CopyPasteTooltip>
              </Grid>
            </Grid>
            {/* API */}
            <Grid container sx={{ mb: 1, mt: 2 }}>
              <Grid item xs={2}>
                <Typography variant="bold">
                  {t('pages.status.sections.details.api')}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <CopyPasteTooltip
                  tooltipMessage={t('common.tooltip.copied')}
                  value={`${metas.api}/api`}
                >
                  <Chip variant="square" label={`${metas.api}/api`} />
                </CopyPasteTooltip>
              </Grid>
            </Grid>
          </>
        </SectionWrapper>
        <SectionWrapper>
          <Table
            items={gateway.versions}
            withPagination={false}
            action
            columns={[
              {
                key: 'name',
                label: t('pages.status.table.columnLabel.name'),
                width: 30,
              },
              {
                key: 'version',
                label: t('pages.status.table.columnLabel.version'),
                width: 30,
              },
              {
                key: 'url',
                label: t('pages.status.table.columnLabel.url'),
                width: 40,
              },
            ]}
            renderItem={(item: GatewayVersion, index) => (
              <Row
                key={index}
                keys={[
                  <Typography key={index}>
                    {lowerCaseAllWordsExceptFirstLetter(item.name)}
                  </Typography>,
                  <Chip
                    key={index}
                    label={
                      item.version === 'unknown'
                        ? t('pages.status.latest')
                        : item.version
                    }
                    variant="square"
                    color="blue"
                  />,
                  <Chip
                    key={index}
                    label={`${metas.api}/api/${item.name}`}
                    variant="square"
                  />,
                  <StatusChip
                    key={index}
                    iconMap={gatewayServicesIconMap}
                    colorMap={gatewayServicesColorMap}
                    status={
                      item.health
                        ? GatewayServiceStatus.UP
                        : GatewayServiceStatus.DOWN
                    }
                  />,
                ]}
                item={item}
              />
            )}
          />
        </SectionWrapper>
      </>
    </Page>
  );
}
