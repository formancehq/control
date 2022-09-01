import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Box } from '@mui/material';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import { Chip, TextField } from '@numaryhq/storybook';
import { buildQuery } from '~/src/utils/search';
import { URLSearchParamsInit } from 'react-router-dom';
import { TextProps } from '~/src/components/Wrappers/Table/Filters/Text/types';
import { getFieldValue } from '../filters';

const Text: FunctionComponent<TextProps> = ({ placeholder, name }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<string | undefined>(undefined);
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    const query = buildQuery(searchParams) as any;
    if (active) {
      const found = query.terms
        ? query.terms.find((val: string) => val === value)
        : undefined;
      if (!found) {
        query.terms = query.terms ? [...query.terms, value] : [value];
      }
    } else {
      query.terms = query.terms
        ? query.terms.filter((val: string) => val !== value)
        : [];
      setValue(undefined);
    }

    setSearchParams(query as URLSearchParamsInit);
  }, [active]);

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
          if (e.keyCode === 13) {
            setValue(`${name}=${value}`);
            setActive(true);
          }
        }}
        sx={{
          m: 0,
          p: 0,
        }}
      />
      {active && value && (
        <Box mt={1}>
          <Chip
            label={getFieldValue(value)}
            variant="square"
            color={'secondary' as 'default'}
            onDelete={() => setActive(false)}
          />
        </Box>
      )}
    </Box>
  );
};
export default Text;
