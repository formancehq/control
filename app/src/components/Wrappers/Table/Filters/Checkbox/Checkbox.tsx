import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Checkbox as MuiCheckbox, ListItemText } from '@mui/material';
import { buildQuery } from '~/src/utils/search';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import { URLSearchParamsInit } from 'react-router-dom';
import { CheckboxProps } from './types';

const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  value,
  label = value,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const all = searchParams.getAll(name);
  const [checked, setChecked] = useState(all.includes(value));

  useEffect(() => {
    setChecked(all.includes(value));
  }, [all, searchParams, value]);

  return (
    <>
      <MuiCheckbox
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => {
          // TODO improve
          const {
            currentTarget: { checked, value, name },
          } = e;
          if (name !== Filters.TERMS && name !== Filters.LEDGERS) {
            return null;
          }

          const query = buildQuery(searchParams) as any;

          if (checked) {
            const find = query[name]
              ? query[name].find((val: string) => val === value)
              : undefined;
            if (!find) {
              query[name] = query[name] ? [...query[name], value] : [value];
            }
          } else {
            query[name] = query[name].filter((val: string) => val !== value);
          }

          setSearchParams(query as URLSearchParamsInit);
        }}
      />
      <ListItemText primary={label} />
    </>
  );
};
export default Checkbox;
