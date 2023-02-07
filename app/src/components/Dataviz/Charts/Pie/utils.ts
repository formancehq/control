import { ObjectOf } from '@numaryhq/storybook';

import { Chart, ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

export const buildPieChart = (labels: string[], datasets: any): Chart => ({
  labels,
  datasets: [datasets],
});

export const buildPieChartDataset = (
  buckets: Bucket[],
  label?: string
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
  borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
  borderWidth: 1,
});
