import React, { FunctionComponent } from 'react';

import { NorthEast, SouthEast } from '@mui/icons-material';

import { PayInChipsProps } from './types';

import { Chip } from '@numaryhq/storybook';

import { PaymentTypes } from '~/src/types/payment';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

const PayInChips: FunctionComponent<PayInChipsProps> = ({ type }) => (
  <Chip
    label={lowerCaseAllWordsExceptFirstLetter(type)}
    variant="square"
    color="blue"
    icon={type === PaymentTypes.PAY_OUT ? <NorthEast /> : <SouthEast />}
  />
);

export default PayInChips;
