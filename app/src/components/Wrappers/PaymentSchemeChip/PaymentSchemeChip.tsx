import React, { FunctionComponent } from 'react';

import { PaymentSchemeChipProps } from './types';

import { Chip } from '@numaryhq/storybook';

import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

export const PaymentSchemeChip: FunctionComponent<PaymentSchemeChipProps> = ({
  scheme,
}) => (
  <Chip
    label={lowerCaseAllWordsExceptFirstLetter(scheme).replace(/sepa/i, 'SEPA')}
    variant="square"
  />
);
