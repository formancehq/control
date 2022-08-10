import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSearchParams } from 'remix';
import { Checkbox } from '@mui/material';
import { SelectCheckboxProps } from '~/src/components/Filters/SelectCheckbox/types';
import { buildQuery } from '~/src/utils/search';
import { isArray } from 'lodash';
import { URLSearchParamsInit } from 'react-router-dom';

const SearchCheckbox: FunctionComponent<SelectCheckboxProps> = ({
  name,
  value,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const all = searchParams.getAll(name);
  const [checked, setChecked] = useState(all.includes(value));

  useEffect(() => {
    setChecked(all.includes(value));
  }, [all, searchParams, value]);

  return (
    <Checkbox
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => {
        const {
          currentTarget: { checked, value },
        } = e;
        let query = buildQuery(searchParams);
        let terms: string[];
        if (query.terms) {
          terms = isArray(query.terms) ? query.terms : [query.terms];
        } else {
          terms = [];
        }

        if (checked) {
          const find = terms.find((t) => t === value);
          if (!find) {
            terms.push(value);
          }
          query = { ...query, terms };
        } else {
          const filtered = terms.filter((t) => t !== value);
          query = { ...query, terms: filtered };
        }

        setSearchParams(query as URLSearchParamsInit);
      }}
    />
  );
};
export default SearchCheckbox;
