import React, { FunctionComponent } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Box } from '@mui/material';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import { TextField } from '@numaryhq/storybook';
import { buildQuery } from '~/src/utils/search';
import { URLSearchParamsInit } from 'react-router-dom';
import { TextProps } from '~/src/components/Wrappers/Table/Filters/Text/types';
import { isEmpty } from 'lodash';

const Text: FunctionComponent<TextProps> = ({ placeholder, name }) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
          const value = e.target.value;
          if (e.keyCode === 13 && value && !isEmpty(value)) {
            const formattedValue = `${name}=${value}`;
            const query = buildQuery(searchParams) as any;
            const found = query.terms
              ? query.terms.find((val: string) => val === value)
              : undefined;
            if (!found) {
              query.terms = query.terms
                ? [...query.terms, formattedValue]
                : [formattedValue];
            } else {
              query.terms = query.terms
                ? query.terms.filter((val: string) => val !== formattedValue)
                : [];
            }
            setSearchParams(query as URLSearchParamsInit);
          }
        }}
        sx={{
          m: 0,
          p: 0,
        }}
      />
    </Box>
  );
};
export default Text;
