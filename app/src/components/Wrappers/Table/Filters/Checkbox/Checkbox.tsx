import React, { FunctionComponent, useEffect, useState } from "react";

import { Checkbox as MuiCheckbox, ListItemButton } from "@mui/material";
import { useSearchParams } from "@remix-run/react";
import { URLSearchParamsInit } from "react-router-dom";

import { CheckboxProps } from "./types";

import { Filters } from "~/src/components/Wrappers/Table/Filters/filters";
import { buildQuery } from "~/src/utils/search";

const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  value,
  label = value,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const all = searchParams.getAll(name);
  const [checked, setChecked] = useState(all.includes(value));

  const handleOnChange = (checked: boolean, value: string, name: string) => {
    // TODO improve
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
