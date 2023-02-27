import { ChartOptions } from 'chart.js';

import { Chart } from '~/src/types/chart';

export type LineProps = {
  data: Chart;
  options?: ChartOptions;
  title?: string;
};
