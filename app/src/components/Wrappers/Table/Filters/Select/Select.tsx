import * as React from 'react';
import { FunctionComponent } from 'react';
import { AutocompleteOption, AutocompleteSelect } from '@numaryhq/storybook';
import { useTranslation } from 'react-i18next';
import {
  buildOptions,
  Filters,
  renderOption,
} from '~/src/components/Wrappers/Table/Filters/filters';
import { Box } from '@mui/material';
import SelectedTags from '~/src/components/Wrappers/Table/Filters/SelectedTags/SelectedTags';
import { SelectProps } from './types';

const Select: FunctionComponent<SelectProps> = ({
  id,
  options,
  field,
  placeholder,
  width = 250,
  name,
  variant = 'light',
  type = Filters.TERMS,
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
          renderOption(props, option, type)
        }
        style={{ width }}
      />
      <Box display="flex" gap={1} flexWrap="wrap">
        <SelectedTags field={field} name={type} />
      </Box>
    </Box>
  );
};

export default Select;
