import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { useLocation, useSearchParams } from '@remix-run/react';
import { omit } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Table as SbTable } from '@numaryhq/storybook';

import SelectedTags from '~/src/components/Wrappers/Table/Filters/SelectedTags/SelectedTags';
import { TableProps } from '~/src/components/Wrappers/Table/types';
import { useTableFilters } from '~/src/hooks/useTableFilters';
import { TableConfig } from '~/src/types/generic';
import { formatTableId } from '~/src/utils/format';
import { buildQuery } from '~/src/utils/search';

const Table: FunctionComponent<TableProps> = ({
  action = false,
  columns,
  id,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { filters } = useTableFilters();
  const key = formatTableId(id);
  const all = searchParams.getAll(`${key}sort`);
  const columnsSortedConfig = [
    ...columns.map((column) => {
      const found = all.find(
        (s: string) => s === `${column.key}:asc` || s === `${column.key}:desc`
      );

      return {
        ...omit(column, ['sort']),
        sort: column.sort
          ? {
              onSort: (key: string, order: 'desc' | 'asc') => {
                const query = buildQuery(searchParams, undefined, key) as any;
                if (query[`${key}sort`]) {
                  query[`${key}sort`] = query[`${key}sort`].filter(
                    (s: string) => s !== `${key}:asc` && s !== `${key}:desc`
                  );
                  query[`${key}sort`] = [
                    ...query[`${key}sort`],
                    `${key}:${order}`,
                  ];
                } else {
                  query[`${key}sort`] = [`${key}:${order}`];
                }
                setSearchParams(query);
              },
              order: found ? found.split(':')[1] : ('desc' as any),
            }
          : undefined,
      };
    }),
  ];

  const columnsConfig = action
    ? [
        ...columnsSortedConfig,
        {
          key: TableConfig.ACTIONS,
          label: t('common.table.actionColumnLabel'),
        },
      ]
    : columnsSortedConfig;

  const paginate = (cursor: string) => {
    const urlParams = new URLSearchParams(location.search);
    const query = Object.fromEntries(urlParams);
    const params = { ...query, [`${key}cursor`]: cursor } as any;
    setSearchParams(params);
  };

  const onNext = (next: string) => {
    paginate(next);
  };

  const onPrevious = (previous: string) => {
    paginate(previous);
  };

  let activeFilters = false;
  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      if (searchParams.getAll(filter.name).length > 0) {
        activeFilters = true;
      }
    });
  }

  return (
    <SbTable
      activeFilters={
        filters && filters.length > 0 && activeFilters ? (
          <Box display="flex" gap={1} flexWrap="wrap" id="filters">
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
