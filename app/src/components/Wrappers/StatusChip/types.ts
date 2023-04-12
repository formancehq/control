import { ReactElement } from 'react';

import { ObjectOf } from '@numaryhq/storybook';

export type StatusChipProps = {
  status: string;
  iconMap: ObjectOf<ReactElement>;
  colorMap: ObjectOf<any>;
  onClick?: () => void;
};
