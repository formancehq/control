import * as React from 'react';
import { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SelectProps } from './types';

import { AutocompleteOption, AutocompleteSelect } from '@numaryhq/storybook';

import {
  buildOptions,
  Filters,
  renderOption,
} from '~/src/components/Wrappers/Table/Filters/filters';

const Select: FunctionComponent<SelectProps> = ({
  id,
  options,
  field,
  placeholder,
  width = 250,
  name,
  variant = 'light',
  type = Filters.TERMS,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box width={width}>
      <AutocompleteSelect
        id={id}
        options={buildOptions(options, field) as readonly any[]}
        name={name}
        placeholder={placeholder}
        renderTags={() => null}
        clearIcon={false}
        variant={variant}
        noOptionsText={t('common.noResults')}
        multiple
        disableCloseOnSelect
        getOptionLabel={(option: AutocompleteOption) => option.label}
        renderOption={(props: any, option: AutocompleteOption) =>
          renderOption(props, option, type, onChange)
        }
        style={{ width }}
      />
    </Box>
  );
};

export default Select;
