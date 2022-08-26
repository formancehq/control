import { NorthEast, SouthEast } from '@mui/icons-material';
import { Chip } from '@numaryhq/storybook';
import React, { FunctionComponent } from 'react';
import { PaymentTypes } from '~/src/types/payment';
import { PayInChipsProps } from './types';

export const PayInChips: FunctionComponent<PayInChipsProps> = ({ type }) => (
  <Chip
    label={type}
    variant="square"
    color={type === PaymentTypes.PAY_OUT ? 'red' : 'green'}
    icon={type === PaymentTypes.PAY_OUT ? <NorthEast /> : <SouthEast />}
  />
);
