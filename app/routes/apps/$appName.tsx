import React from 'react';

import { Delete, RestartAlt, Visibility } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { get, pickBy } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';

import {
  ActionZone,
  Date,
  JsonViewer,
  Page,
  Row,
  SectionWrapper,
  ShellViewer,
} from '@numaryhq/storybook';

import Line from '~/src/components/Dataviz/Charts/Line';
import { buildLineChartDataset } from '~/src/components/Dataviz/Charts/Line/utils';
import Pie from '~/src/components/Dataviz/Charts/Pie';
import { buildPieChartDataset } from '~/src/components/Dataviz/Charts/Pie/utils';
import {
  buildChart,
  buildDateHistogramAggs,
  buildLabels,
  buildPayloadQuery,
  buildQueryPayloadMatchPhrase,
  buildRange,
  buildTermsAggs,
} from '~/src/components/Dataviz/Charts/utils';
import { APPS_ROUTE } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary/ComponentErrorBoundary';
import Modal from '~/src/components/Wrappers/Modal/Modal';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  appColorMap,
  appIconMap,
  appTaskColorMap,
  appTaskIconMap,
  paymentTypeColorMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';
import { Chart } from '~/src/types/chart';
import {
  Connector,
  ConnectorStatuses,
  ConnectorTask,
} from '~/src/types/connectorsConfig';
import { Bucket, SearchTargets } from '~/src/types/search';
import { API_PAYMENT, API_SEARCH, ApiClient } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';
import { QueryContexts, sanitizeQuery } from '~/src/utils/search';

export const meta: MetaFunction = () => ({
  title: 'App details',
  description: 'Show App details',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="app-details"
      title="pages.apps.title"
      error={error}
      showAction={false}
    />
  );
}

const getDataPieChart = async (api: ApiClient, provider: string) =>
  await api.postResource<Bucket[]>(
    API_SEARCH,
    {
      raw: buildPayloadQuery(
        'indexed.createdAt',
        buildTermsAggs('indexed.type'),
        SearchTargets.PAYMENT,
        undefined,
        undefined,
        [
          ...buildQueryPayloadMatchPhrase([
            { key: 'indexed.provider', value: provider },
          ]),
          buildRange('indexed.createdAt', 'now-7d/d'),
        ]
      ),
    },
    'aggregations.chart.buckets'
  );

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.appName, 'Expected params.appName');
    const api = await createApiClient(session);
    const query = sanitizeQuery(request, QueryContexts.PARAMS);
    const provider = params.appName?.toUpperCase();
    const tasks = await api.getResource<ConnectorTask[]>(
      `${API_PAYMENT}/connectors/${params.appName}/tasks?${query}`,
      'cursor'
    );
    const connectors = await api.getResource<Connector[]>(
      `${API_PAYMENT}/connectors`,
      'data'
    );

    const connector = connectors
      ? connectors.find(
          (connector: Connector) => connector.provider === provider
        )
      : {};

    const chartPieData = await getDataPieChart(api, provider);
    const datasetPie = buildPieChartDataset(
      chartPieData!.map((data: Bucket) => ({
        ...data,
        backgroundColor: get(paymentTypeColorMap, data.key),
      })),
      undefined,
      false
    );

    const chartLineData = await api.postResource<Bucket[]>(
      API_SEARCH,
      {
        raw: buildPayloadQuery(
          'indexed.createdAt',
          buildDateHistogramAggs('indexed.createdAt'),
          SearchTargets.PAYMENT,
          undefined,
          undefined,
          [
            ...buildQueryPayloadMatchPhrase([
              { key: 'indexed.provider', value: provider },
            ]),
            buildRange('indexed.createdAt'),
          ]
        ),
      },
      'aggregations.chart.buckets'
    );
    const datasetLine = buildLineChartDataset(
      chartLineData!,
      i18n.t('pages.payment.title')
    );

    if (tasks) {
      return {
        tasks,
        connector,
        chart: {
          pie: buildChart(buildLabels([datasetPie]), [datasetPie]),
          line: buildChart(buildLabels([datasetLine], 'LT'), [datasetLine]),
        },
      };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

const renderConfirmModalContent = (
  connector: string,
  action: 'delete' | 'reset',
  t: any
): JSX.Element => (
  <>
    <Typography pb={1}>{t('common.dialog.messages.warning')}</Typography>
    <Typography>
      <Trans
        i18nKey={`pages.app.sections.dangerZone.${action}.confirm`}
        values={{
          item: lowerCaseAllWordsExceptFirstLetter(connector),
        }}
        components={{ bold: <strong /> }}
      />
    </Typography>
  </>
);

export default function Index() {
  const { t } = useTranslation();
  const { tasks, connector, chart } = useLoaderData<{
    tasks: any;
    connector: Connector;
    chart: { pie: Chart; line: Chart };
  }>();
  const navigate = useNavigate();
  const { api, snackbar } = useService();
  const provider = lowerCaseAllWordsExceptFirstLetter(connector.provider);
  const onDelete = async (name: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_PAYMENT}/connectors/${connector.provider}`
      );
      if (result) {
        navigate(APPS_ROUTE);
      }
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: name,
        })
      );
    }
  };

  const onReset = async (name: string) => {
    try {
      const result = await api.postResource<unknown>(
        `${API_PAYMENT}/connectors/${name}/reset`,
        {}
      );
      if (result) snackbar(t('common.feedback.success'));
    } catch {
      snackbar(t('common.feedback.error'));
    }
  };

  return (
    <Page
      id="app-details"
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ProviderPicture provider={connector.provider} text={false} />
          <Typography variant="h1" component="h1" sx={{ ml: 2 }}>
            {provider}
          </Typography>
        </Box>
      }
    >
      <>
        {/* Charts */}
        <Box sx={{ display: 'flex' }} gap="26px">
          <Box
            sx={{
              width: '30%',
            }}
          >
            <Pie
              data={chart.pie}
              time={{ value: '7', kind: 'days' }}
              options={{
                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
              title={t('pages.app.sections.charts.payment', {
                provider,
              })}
            />
          </Box>
          <Box sx={{ width: 'calc(70% - 26px)' }}>
            <Line
              title={t('pages.app.sections.charts.transaction', {
                provider,
              })}
              data={chart.line}
            />
          </Box>
        </Box>
        {/* Danger zone */}
        <SectionWrapper
          title={t('pages.app.sections.dangerZone.title')}
          element={
            // TODO uncomment when backend is ready (https://linear.app/formance/issue/NUM-1374/payments-connectors-always-enabled)
            <StatusChip
              iconMap={appIconMap}
              colorMap={appColorMap}
              status={ConnectorStatuses.ACTIVE} // hardcoded for now
            />
          }
        >
          <ActionZone
            actions={[
              {
                key: 'delete-app',
                title: t('pages.app.sections.dangerZone.delete.title'),
                description: t(
                  'pages.app.sections.dangerZone.delete.description'
                ),
                button: (
                  <Modal
                    button={{
                      id: `delete-${name}`,
                      startIcon: <Delete />,
                      content: t('pages.app.sections.dangerZone.delete.button'),
                      variant: 'error',
                    }}
                    modal={{
                      id: `delete-${name}-modal`,
                      PaperProps: { sx: { minWidth: '500px' } },
                      title: t('common.dialog.deleteTitle'),
                      actions: {
                        save: {
                          variant: 'error',
                          label: t('common.dialog.confirmButton'),
                          onClick: () => onDelete(connector.provider),
                        },
                      },
                    }}
                  >
                    {renderConfirmModalContent(connector.provider, 'delete', t)}
                  </Modal>
                ),
              },
              {
                key: 'reset-app',
                title: t('pages.app.sections.dangerZone.reset.title'),
                description: t(
                  'pages.app.sections.dangerZone.reset.description'
                ),
                button: (
                  <Modal
                    button={{
                      id: `delete-${name}`,
                      startIcon: <RestartAlt />,
                      content: t('pages.app.sections.dangerZone.reset.button'),
                      variant: 'error',
                    }}
                    modal={{
                      id: `reset-${name}-modal`,
                      PaperProps: { sx: { minWidth: '500px' } },
                      title: t('common.dialog.resetTitle'),
                      actions: {
                        save: {
                          variant: 'error',
                          label: t('common.dialog.confirmButton'),
                          onClick: () => onReset(connector.provider),
                        },
                      },
                    }}
                  >
                    {renderConfirmModalContent(connector.provider, 'reset', t)}
                  </Modal>
                ),
              },
            ]}
          />
        </SectionWrapper>
        {/* Tasks section */}
        <SectionWrapper title={t('pages.app.sections.tasks.title')}>
          <Table
            id="task-list"
            items={tasks}
            action
            columns={[
              {
                key: 'status',
                label: t('pages.app.sections.tasks.table.columnLabel.status'),
              },
              {
                key: 'error',
                label: t('pages.app.sections.tasks.table.columnLabel.error'),
              },
              {
                key: 'createdAt',
                label: t(
                  'pages.app.sections.tasks.table.columnLabel.createdAt'
                ),
              },
              {
                key: 'descriptor',
                label: t(
                  'pages.app.sections.tasks.table.columnLabel.descriptor'
                ),
              },
            ]}
            renderItem={(task: any, index: number) => (
              <Row
                key={index}
                item={task}
                keys={[
                  <StatusChip
                    key={index}
                    iconMap={appTaskIconMap}
                    colorMap={appTaskColorMap}
                    status={task.status}
                  />,
                  <Box component="span" key={index}>
                    {task.error ? (
                      <Modal
                        key={index}
                        button={{
                          id: `show-error-logs-${index}`,
                          variant: 'stroke',
                          startIcon: <Visibility />,
                          content: t(
                            'pages.app.sections.tasks.table.rows.showErrorLogs'
                          ),
                        }}
                        modal={{
                          id: `show-error-logs-modal-${index}`,
                          PaperProps: { sx: { minWidth: '500px' } },
                          title: t(
                            'pages.app.sections.tasks.table.rows.logsModalTitle'
                          ),
                        }}
                      >
                        <ShellViewer data={task.error} />
                      </Modal>
                    ) : (
                      <Typography variant="placeholder">
                        {t('pages.app.sections.tasks.table.rows.noLogs')}
                      </Typography>
                    )}
                  </Box>,
                  <Box key={index}>
                    <Date timestamp={task.createdAt} />
                  </Box>,
                  <JsonViewer
                    key={index}
                    jsonData={pickBy(
                      task.descriptor,
                      (value) => value.length > 0
                    )}
                  />,
                ]}
              />
            )}
          />
        </SectionWrapper>
      </>
    </Page>
  );
}
