import React from 'react';

import { ContentCopy, Delete, RestartAlt } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { capitalize, pickBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';

import {
  Chip,
  JsonViewer,
  Date,
  Page,
  Row,
  SectionWrapper,
  LoadingButton,
} from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary/ComponentErrorBoundary';
import Modal from '~/src/components/Wrappers/Modal/Modal';
import Table from '~/src/components/Wrappers/Table/Table';
import { useService } from '~/src/hooks/useService';
import { Connectors } from '~/src/types/connectorsConfig';
import { API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

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

export const loader: LoaderFunction = async ({ request, params }) => {
  async function handleData(session: Session) {
    invariant(params.appName, 'Expected params.appName');

    const appTask = await (
      await createApiClient(session)
    ).getResource<any>(`${API_PAYMENT}/connectors/${params.appName}/tasks`);

    const appStatus = await (
      await createApiClient(session)
    ).getResource<any>(`${API_PAYMENT}/connectors`, 'data');

    const filteredAppStatus = appStatus
      ? appStatus.find((app: Connectors) => app.provider === params.appName)
      : {};

    if (appTask) {
      return { appTask, filteredAppStatus, appName: params.appName };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

const renderErrorLogModal = (index: number, t: any, errorLog: string) => (
  <Modal
    key={index}
    button={{
      id: `show-error-logs-${index}`,
      variant: 'dark',
      content: t('pages.app.table.showErrorLogs'),
    }}
    modal={{
      id: `show-error-logs-modal-${index}`,
      PaperProps: { sx: { minWidth: '500px' } },
      title: t('pages.app.table.errorLogs'),
    }}
  >
    <Box
      sx={{
        background: (theme) => theme.palette.neutral[900],
        color: (theme) => theme.palette.default.bright,
        p: '10px',
        height: '200px',
        display: 'flex',
        borderRadius: '4px',
        mb: '26px',
      }}
    >
      <Typography variant="headline">{errorLog}</Typography>
      <LoadingButton
        id="copyToCliboardWrapper"
        variant="dark"
        startIcon={<ContentCopy />}
      />
    </Box>
  </Modal>
);

export default function Index() {
  const { t } = useTranslation();
  const loaderData = useLoaderData<any>();
  const { api, snackbar } = useService();

  // TODO add navigate
  const onDelete = async (connectorName: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_PAYMENT}/connectors/${connectorName}`
      );
    } catch {
      snackbar(
        t('common.feedback.delete', {
          item: connectorName,
        })
      );
    }
  };

  // TODO add reset behavior
  const onReset = async (connectorName: string) => {
    try {
      await api.postResource<unknown>(
        `${API_PAYMENT}/connectors/${connectorName}/reset`,
        {}
      );
    } catch {
      snackbar(t('common.feedback.error'));
    }
  };

  return (
    <Page id="app-details">
      <Box mt="26px">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 26px 26px 26px',
            backgroundColor: (theme) => theme.palette.neutral[0],
          }}
        >
          <SectionWrapper
            title={capitalize(loaderData.appName) + ' status'}
            button={{
              content: loaderData.filteredAppStatus.disabled
                ? 'Active'
                : 'Error',
              variant: loaderData.filteredAppStatus.disabled
                ? 'primary'
                : 'error',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                borderRadius: '4px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '95%',
                  m: '10px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="bold">
                    {t('pages.app.dangerZone.deleteConnector')}
                  </Typography>
                  <Typography variant="action" color="text.secondary">
                    {t('pages.app.dangerZone.deleteConnectorInfo')}
                  </Typography>
                </Box>
                <Modal
                  button={{
                    id: `delete-${loaderData.appName}`,
                    variant: 'error',
                    content: t('pages.app.dangerZone.deleteConnector'),
                    startIcon: <Delete />,
                  }}
                  modal={{
                    id: `delete-${loaderData.appName}-modal`,
                    PaperProps: { sx: { minWidth: '500px' } },
                    title: t('common.dialog.deleteTitle'),
                    actions: {
                      save: {
                        variant: 'error',
                        label: t('common.dialog.confirmButton'),
                        onClick: () => onDelete(loaderData.appName),
                      },
                    },
                  }}
                >
                  <Typography>
                    {t('pages.app.dangerZone.deleteConnectorInfo')}
                  </Typography>
                </Modal>
              </Box>
              <Divider
                sx={{
                  width: '100%',
                  background: (theme) => theme.palette.neutral[100],
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '95%',
                  m: '10px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="bold">
                    {t('pages.app.dangerZone.resetConnector')}
                  </Typography>
                  <Typography variant="action" color="text.secondary">
                    {t('pages.app.dangerZone.resetConnectorInfo')}
                  </Typography>
                </Box>
                <Modal
                  button={{
                    id: `reset-${loaderData.appName}`,
                    content: t('pages.app.dangerZone.resetConnector'),
                    variant: 'error',
                    startIcon: <RestartAlt />,
                  }}
                  modal={{
                    id: `reset-${loaderData.appName}-modal`,
                    PaperProps: { sx: { minWidth: '500px' } },
                    title: t('common.dialog.confirmation', {
                      action: t('common.dialog.resetTitle'),
                    }),
                    actions: {
                      save: {
                        variant: 'error',
                        label: t('common.dialog.confirmButton'),
                        onClick: () => onReset(loaderData.appName),
                      },
                    },
                  }}
                >
                  <Typography>
                    {t('pages.app.dangerZone.resetConnectorInfo')}
                  </Typography>
                </Modal>
              </Box>
            </Box>
          </SectionWrapper>
          <SectionWrapper title={'Tasks'}>
            <Table
              id="connectors-list"
              items={loaderData.appTask}
              action={true}
              withPagination={false}
              columns={[
                {
                  key: 'status',
                  label: 'status',
                },
                {
                  key: 'error',
                  label: 'error',
                },
                {
                  key: 'createdAt',
                  label: 'createdAt',
                },
                {
                  key: 'descriptor',
                  label: 'descriptor',
                },
              ]}
              renderItem={(task: any, index: number) => (
                <Row
                  key={index}
                  item={task}
                  keys={[
                    <Chip
                      key={index}
                      color={task.status ? 'green' : 'red'}
                      label={
                        task.status
                          ? t('common.status.active')
                          : t('common.status.error')
                      }
                      variant="square"
                    />,
                    <>
                      {!!task.error &&
                        renderErrorLogModal(index, t, task.error)}
                    </>,
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
        </Box>
      </Box>
    </Page>
  );
}
