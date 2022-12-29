import React, { FunctionComponent } from 'react';

import {
  Block,
  Done,
  ErrorOutline,
  HourglassTop,
  MoreHoriz,
} from '@mui/icons-material';
import { get } from 'lodash';

import { PaymentStatusChipProps } from './types';

import { Chip, ColorVariants } from '@numaryhq/storybook';

import { PaymentStatuses } from '~/src/types/payment';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

const PaymentStatusChip: FunctionComponent<PaymentStatusChipProps> = ({
  status,
}) => {
  const iconMap = {
    [PaymentStatuses.FAILED]: <ErrorOutline />,
    [PaymentStatuses.SUCCEEDED]: <Done />,
    [PaymentStatuses.PENDING]: <HourglassTop />,
    [PaymentStatuses.CANCELLED]: <Block />,
    [PaymentStatuses.OTHER]: <MoreHoriz />,
  };
  const colorMap = {
    [PaymentStatuses.FAILED]: 'red',
    [PaymentStatuses.SUCCEEDED]: 'green',
    [PaymentStatuses.PENDING]: 'blue',
    [PaymentStatuses.CANCELLED]: 'brown',
    [PaymentStatuses.OTHER]: 'violet',
  };
  const icon = get(iconMap, status, iconMap[PaymentStatuses.OTHER]);
  const color = get(colorMap, status, iconMap[PaymentStatuses.OTHER]);

  return (
    <Chip
      label={lowerCaseAllWordsExceptFirstLetter(status)}
      variant="square"
      color={color as ColorVariants}
      icon={icon}
    />
  );
};

export default PaymentStatusChip;
