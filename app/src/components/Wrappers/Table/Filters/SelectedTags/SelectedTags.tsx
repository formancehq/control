import * as React from 'react';
import { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from '@remix-run/react';
import { first } from 'lodash';
import { URLSearchParamsInit } from 'react-router-dom';

import { Chip } from '@numaryhq/storybook';

import { Filters, getFieldValue } from '../filters';

import { SelectedTagsProps } from '~/src/components/Wrappers/Table/Filters/SelectedTags/types';
import { useTable } from '~/src/hooks/useTable';
import { buildQuery, resetCursor } from '~/src/utils/search';

const SelectedTags: FunctionComponent<SelectedTagsProps> = ({
  name,
  field,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const all = searchParams.getAll(name);
  const { filters, id } = useTable();
  const chips = all.filter((item) =>
    name === Filters.TERMS ? first(item.split('=')) === field : item
  );
  const onDelete = (item: string) => {
    let query = buildQuery(searchParams) as any;
    query = resetCursor(query, id);
    query.terms = query.terms
      ? query.terms.filter((val: string) => val !== item)
      : [];
    query.ledgers = query.ledgers
      ? query.ledgers.filter((val: string) => val !== item)
      : [];
    setSearchParams(query as URLSearchParamsInit);
  };

  return (
    <>
      {chips.length > 0 &&
        chips.map((item: string, index: number) => {
          const filterConfig =
            filters && filters.find((filter) => filter.field === field);

          return (
            <Box mt={1} component="span" key={index}>
              <Chip
                label={
                  field ? getFieldValue(item, filterConfig?.formatLabel) : item
                }
                variant="square"
                onDelete={() => onDelete(item)}
              />
            </Box>
          );
        })}
    </>
  );
};

export default SelectedTags;
