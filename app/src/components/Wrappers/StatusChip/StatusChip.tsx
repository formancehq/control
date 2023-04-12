import React, { FunctionComponent } from 'react';

import { MoreHoriz } from '@mui/icons-material';
import { get } from 'lodash';

import { StatusChipProps } from './types';

import { Chip, ColorVariants } from '@numaryhq/storybook';

import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

const StatusChip: FunctionComponent<StatusChipProps> = ({
  iconMap,
  colorMap,
  status,
  onClick,
}) => {
  const icon = get(iconMap, status, <MoreHoriz />);
  const color = get(colorMap, status, 'violet') as ColorVariants;

  return (
    <Chip
      label={lowerCaseAllWordsExceptFirstLetter(status)}
      variant="square"
      color={color}
      icon={icon}
      onClick={onClick}
    />
  );
};

export default StatusChip;
