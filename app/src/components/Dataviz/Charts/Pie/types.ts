import { SxProps } from '@mui/system';
import { ChartOptions } from 'chart.js';

import { Chart } from '~/src/types/chart';

export type PieProps = {
  data: Chart;
  options?: ChartOptions;
  title?: string;
  height?: number;
  time?: { value: string; kind: string };
  sxTitle?: SxProps;
  sxSubtitle?: SxProps;
};
