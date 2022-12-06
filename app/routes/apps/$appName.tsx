import React from 'react';

import { Delete, RestartAlt, Visibility } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { pickBy } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';

import {
  ActionZone,
  Chip,
  Date,
  JsonViewer,
  Page,
  Row,
  SectionWrapper,
  ShellViewer,
} from '@numaryhq/storybook';

import { APPS_ROUTE } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary/ComponentErrorBoundary';
import Modal from '~/src/components/Wrappers/Modal/Modal';
import Table from '~/src/components/Wrappers/Table/Table';
import { useService } from '~/src/hooks/useService';
import { Connector, ConnectorTask } from '~/src/types/connectorsConfig';
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

    const tasks = await (
      await createApiClient(session)
    ).getResource<ConnectorTask[]>(
      `${API_PAYMENT}/connectors/${params.appName}/tasks`
    );
    const connectors = await (
      await createApiClient(session)
    ).getResource<Connector[]>(`${API_PAYMENT}/connectors`, 'data');

    const status = connectors
      ? connectors.find(
          (connector: Connector) => connector.provider === params.appName
        )
      : {};

    if (tasks) {
      return {
        tasks,
        status,
        name: params.appName,
      };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { t } = useTranslation();
  const { tasks, name, status } = useLoaderData<any>();
  const navigate = useNavigate();
  const { api, snackbar } = useService();

  const onDelete = async (name: string) => {
    try {
      const result = await api.deleteResource<unknown>(
        `${API_PAYMENT}/connectors/${name}`
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
    <Page id="app-details" title={name}>
      <>
        {/* Danger zone */}
        <SectionWrapper
          title={t('pages.app.sections.dangerZone.title')}
          element={
            <Chip
              variant="square"
              color={status.disabled ? 'red' : 'green'}
              label={t(
                `pages.app.sections.dangerZone.status.${
                  status.disabled ? 'error' : 'active'
                }`
              )}
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
                          onClick: () => onDelete(name),
                        },
                      },
                    }}
                  >
                    <Typography>
                      <Trans
                        i18nKey="common.dialog.messages.confirmDelete"
                        values={{ item: name }}
                        components={{ bold: <strong /> }}
                      />
                    </Typography>
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
                          onClick: () => onReset(name),
                        },
                      },
                    }}
                  >
                    <Typography>
                      <Trans
                        i18nKey="common.dialog.messages.confirmReset"
                        values={{ item: name }}
                        components={{ bold: <strong /> }}
                      />
                    </Typography>
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
            withPagination={false}
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
