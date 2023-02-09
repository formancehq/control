import { ObjectOf, theme } from '@numaryhq/storybook';

import { getPaletteRandomColor } from '~/src/components/Dataviz/Charts/utils';
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
  backgroundColor: buckets.map(() => getPaletteRandomColor()),
  borderColor: buckets.map(() => theme.palette.neutral[0]),
  borderWidth: 2,
});
