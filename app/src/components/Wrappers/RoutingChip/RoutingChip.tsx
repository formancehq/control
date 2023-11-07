import React, { FunctionComponent } from 'react';

import { RoutingChipProps } from './types';

import { Chip } from '@numaryhq/storybook';

import { useService } from '~/src/hooks/useService';

const RoutingChip: FunctionComponent<RoutingChipProps> = ({
  label,
  color,
  variant = 'square',
  route,
}) => {
  const { metas } = useService();
  const routing = () => {
    if (route) {
      window.open(`${metas.origin}${route}`, '_blank', 'noreferrer');
    }
  };

  return (
    <Chip
      label={label}
      variant={variant}
      color={color}
      sx={{ overflow: 'hidden' }}
      onClick={routing}
    />
  );
};

export default RoutingChip;
