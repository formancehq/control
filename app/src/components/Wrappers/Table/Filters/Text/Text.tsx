import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { useSearchParams } from '@remix-run/react';
import { isEmpty } from 'lodash';
import { URLSearchParamsInit } from 'react-router-dom';

import { TextField } from '@numaryhq/storybook';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import { TextProps } from '~/src/components/Wrappers/Table/Filters/Text/types';
import { useTable } from '~/src/hooks/useTable';
import { formatTableId } from '~/src/utils/format';
import { buildQuery, resetCursor } from '~/src/utils/search';

const Text: FunctionComponent<TextProps> = ({ placeholder, name }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useTable();

  return (
    <Box
      sx={{
        '& .MuiFormControl-root': {
          m: 0,
          p: 0,
        },
      }}
    >
      <TextField
        placeholder={placeholder}
        name={Filters.TERMS}
        onKeyDown={(e: any) => {
          const key = formatTableId(id);
          const value = e.target.value;
          if (e.keyCode === 13 && value && !isEmpty(value)) {
            const formattedValue = `${name}=${value}`;
            let query = buildQuery(searchParams, undefined, id) as any;
            query = resetCursor(query, id);
            const regex = `${name}=`;
            const index = query[`${key}terms`]
              ? query[`${key}terms`].findIndex((val: string) =>
                  val.match(regex)
                )
              : -1;
            if (index === -1) {
              query[`${key}terms`] = query[`${key}terms`]
                ? [...query[`${key}terms`], formattedValue]
                : [formattedValue];
            } else {
              query[`${key}terms`][index] = formattedValue;
            }
            setSearchParams(query as URLSearchParamsInit);
          }
        }}
      />
    </Box>
  );
};
export default Text;
