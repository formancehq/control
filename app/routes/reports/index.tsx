import * as React from 'react';
import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal, Page, TextField } from '@numaryhq/storybook';

import { LedgerList } from '~/routes/ledgers/list';
import { ReportFormInput, reportSchema } from '~/routes/reports/service';
import { reports as reportsConfig } from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ReportList from '~/src/components/Wrappers/Lists/ReportList';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import { TableFiltersContext } from '~/src/contexts/tableFilters';
import { Report } from '~/src/types/report';
import { API_REPORT, ApiClient } from '~/src/utils/api';

export const meta: MetaFunction = () => ({
  title: 'Reports',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({
  request,
}): Promise<Report[] | null> => {
  const url = new URL(request.url);
  // todo remove url hardocoded for prod
  const reports = await new ApiClient('http://localhost:3200').getResource<
    Report[]
  >(`${API_REPORT}/${url.search}`, 'data');
  if (reports) {
    return reports;
  }

  return null;
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={reportsConfig.id}
      title="pages.reports.title"
      error={error}
    />
  );
}

export default function Index() {
  const reports = useLoaderData<Report[]>();
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  const { control } = useForm<ReportFormInput>({
    resolver: yupResolver(reportSchema),
    mode: 'onChange',
  });

  return (
    <Page
      actionEvent="generate-report"
      id={reportsConfig.id}
      actionId="generate-report"
      actionLabel={t('pages.reports.generate.button')}
      onClick={handleOpen}
    >
      <>
        <Modal
          open={open}
          onClose={handleClose}
          title={t('common.dialog.createTitle')}
          actions={{
            cancel: {
              onClick: handleClose,
              label: t('common.dialog.cancelButton'),
            },
            save: {
              onClick: () => null,
              label: t('common.dialog.saveButton'),
            },
          }}
        >
          <form>
            <Controller
              name="json"
              control={control}
              render={({ field }) => <TextField {...field} />}
            />
          </form>
        </Modal>
        <TableFiltersContext.Provider
          value={{
            filters: [{ field: 'ledgers', name: Filters.LEDGERS }],
          }}
        >
          <Form method="get">
            <FiltersBar>
              <LedgerList />
            </FiltersBar>
            <ReportList reports={reports as unknown as Report[]} />
          </Form>
        </TableFiltersContext.Provider>
      </>
    </Page>
  );
}
