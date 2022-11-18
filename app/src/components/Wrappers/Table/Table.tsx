import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { Table as SbTable } from '@numaryhq/storybook';

import SelectedTags from '~/src/components/Wrappers/Table/Filters/SelectedTags/SelectedTags';
import { TableProps } from '~/src/components/Wrappers/Table/types';
import { useTableFilters } from '~/src/hooks/useTableFilters';
import { TableConfig } from '~/src/types/generic';

const Table: FunctionComponent<TableProps> = ({
  action = false,
  columns,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters } = useTableFilters();

  const columnsConfig = action
    ? [
        ...columns,
        {
          key: TableConfig.ACTIONS,
          label: t('common.table.actionColumnLabel'),
        },
      ]
    : columns;

  const onNext = (next: string) => {
    setSearchParams({
      target: searchParams.get('target') as string,
      cursor: next,
    });
  };

  const onPrevious = (previous: string) => {
    setSearchParams({
      target: searchParams.get('target') as string,
      cursor: previous,
    });
  };

  return (
    <SbTable
      activeFilters={
        filters && filters.length > 0 ? (
          <Box display="flex" gap={1} flexWrap="wrap">
            {filters.map(({ field, name }, index) => (
              <SelectedTags field={field} name={name} key={index} />
            ))}
          </Box>
        ) : undefined
      }
      {...props}
      labels={{
        pagination: {
          showing: t('common.table.pagination.showing'),
          separator: t('common.table.pagination.separator'),
          results: t('common.table.pagination.results'),
        },
        noResults: t('common.noResults'),
      }}
      onNext={onNext}
      onPrevious={onPrevious}
      columns={columnsConfig}
    />
  );
};

export default Table;
