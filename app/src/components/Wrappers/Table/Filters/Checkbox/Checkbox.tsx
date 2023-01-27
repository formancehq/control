import React, { FunctionComponent, useEffect, useState } from 'react';

import { Checkbox as MuiCheckbox, ListItemButton } from '@mui/material';
import { useSearchParams } from '@remix-run/react';
import { URLSearchParamsInit } from 'react-router-dom';

import { CheckboxProps } from './types';

import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import { useTable } from '~/src/hooks/useTable';
import { buildQuery, resetCursor } from '~/src/utils/search';

const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  value,
  label = value,
  onChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const all = searchParams.getAll(name);
  const [checked, setChecked] = useState(all.includes(value));
  const { id } = useTable();

  const handleOnChange = (checked: boolean, value: string, name: string) => {
    // TODO improve to make it generic (maybe a factory ?)

    if (onChange) {
      onChange();
    } else {
      if (name !== Filters.TERMS && name !== Filters.LEDGERS) {
        return null;
      }
      let query = buildQuery(searchParams) as any;
      query = resetCursor(query, id);
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
    }
  };

  useEffect(() => {
    setChecked(all.includes(value));
  }, [all, searchParams, value]);

  return (
    <ListItemButton
      onClick={() => {
        handleOnChange(!searchParams.getAll(name).includes(value), value, name);
      }}
    >
      <MuiCheckbox
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => {
          const {
            currentTarget: { checked, value, name },
          } = e;
          handleOnChange(checked, value, name);
        }}
      />
      {label}
    </ListItemButton>
  );
};
export default Checkbox;
