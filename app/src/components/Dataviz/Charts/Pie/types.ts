import { ChartOptions } from 'chart.js';

import { Chart } from '~/src/types/chart';

export type PieProps = {
  data: Chart;
  options: ChartOptions;
};
