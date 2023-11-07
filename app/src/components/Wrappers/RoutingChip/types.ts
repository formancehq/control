import { ChipPropsVariantOverrides } from '@mui/material/Chip/Chip';
import { OverridableStringUnion } from '@mui/types';

import { ColorVariants } from '@numaryhq/storybook';

export type RoutingChipProps = {
  label: string;
  route?: string;
  variant?: OverridableStringUnion<
    'filled' | 'outlined',
    ChipPropsVariantOverrides
  >;
  color?: ColorVariants;
};
