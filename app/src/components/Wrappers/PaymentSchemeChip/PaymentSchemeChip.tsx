import React, { FunctionComponent } from 'react';

import { AccountBalance, CreditCard } from '@mui/icons-material';
import { Box, Chip } from '@mui/material';

import { PaymentSchemeChipProps } from './types';

import { PaymentSchemes } from '~/src/types/payment';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

export const PaymentSchemeChip: FunctionComponent<PaymentSchemeChipProps> = ({
  scheme,
}) => {
  const iconize = (icon: JSX.Element) => (
    <Box
      sx={{
        opacity: 0.5,
      }}
    >
      {icon}
    </Box>
  );

  const icons: {
    [key in PaymentSchemes]: JSX.Element;
  } = {
    [PaymentSchemes.SEPA_CREDIT]: iconize(<AccountBalance fontSize="small" />),
    [PaymentSchemes.SEPA_DEBIT]: iconize(<AccountBalance fontSize="small" />),
    [PaymentSchemes.MASTERCARD]: iconize(<CreditCard fontSize="small" />),
  };

  return (
    <Chip
      sx={
        {
          // display: 'flex',
          // alignItems: 'center',
        }
      }
      label={lowerCaseAllWordsExceptFirstLetter(scheme).replace(
        /sepa/i,
        'SEPA'
      )}
      variant="square"
    />
  );
};
