import React, { FunctionComponent } from 'react';

import { NorthEast, SouthEast } from '@mui/icons-material';

import { PayInChipsProps } from './types';

import { Chip } from '@numaryhq/storybook';

import { PaymentTypes } from '~/src/types/payment';

const PayInChips: FunctionComponent<PayInChipsProps> = ({ type }) => (
  <Chip
    label={type}
    variant="square"
    color={type === PaymentTypes.PAY_OUT ? 'red' : 'green'}
    icon={type === PaymentTypes.PAY_OUT ? <NorthEast /> : <SouthEast />}
  />
);

export default PayInChips;
