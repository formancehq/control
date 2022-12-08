import React, { FunctionComponent } from "react";

import { Box } from "@mui/material";
import { useSearchParams } from "@remix-run/react";
import { omit } from "lodash";
import { useTranslation } from "react-i18next";

import { Table as SbTable } from "@numaryhq/storybook";

import SelectedTags from "~/src/components/Wrappers/Table/Filters/SelectedTags/SelectedTags";
import { TableProps } from "~/src/components/Wrappers/Table/types";
import { useTableFilters } from "~/src/hooks/useTableFilters";
import { TableConfig } from "~/src/types/generic";
import { buildQuery } from "~/src/utils/search";

const Table: FunctionComponent<TableProps> = ({
  action = false,
  columns,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters } = useTableFilters();
  const all = searchParams.getAll("sort");
  const columnsSortedConfig = [
    ...columns.map((column) => {
      const found = all.find(
        (s: string) => s === `${column.key}:asc` || s === `${column.key}:desc`
      );

      return {
        ...omit(column, ["sort"]),
        sort: column.sort
          ? {
              onSort: (key: string, order: "desc" | "asc") => {
                const query = buildQuery(searchParams) as any;

                if (query.sort) {
                  query.sort = query.sort.filter(
                    (s: string) => s !== `${key}:asc` && s !== `${key}:desc`
                  );
                  query.sort = [...query.sort, `${key}:${order}`];
                } else {
                  query.sort = [`${key}:${order}`];
                }
                setSearchParams(query);
              },
              order: found ? found.split(":")[1] : ("desc" as any),
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
          label: t("common.table.actionColumnLabel"),
        },
      ]
    : columnsSortedConfig;
  const onNext = (next: string) => {
    setSearchParams({
      target: searchParams.get("target") as string,
      cursor: next,
    });
  };

  const onPrevious = (previous: string) => {
    setSearchParams({
      target: searchParams.get("target") as string,
      cursor: previous,
    });
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
          showing: t("common.table.pagination.showing"),
          separator: t("common.table.pagination.separator"),
          results: t("common.table.pagination.results"),
        },
        noResults: t("common.noResults"),
      }}
      onNext={onNext}
      onPrevious={onPrevious}
      columns={columnsConfig}
    />
  );
};

export default Table;
