import { ObjectOf, theme } from '@numaryhq/storybook';

import { getPaletteRandomColor } from '~/src/components/Dataviz/Charts/utils';
import { ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

export const buildPieChartDataset = (
  buckets: Bucket[],
  label?: string
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  backgroundColor: buckets.map(() => getPaletteRandomColor()),
  borderColor: buckets.map(() => theme.palette.neutral[0]),
  labels: buckets.map((bucket) => bucket.key),
  borderWidth: 2,
});
