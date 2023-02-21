import { get } from 'lodash';

import { ObjectOf, theme } from '@numaryhq/storybook';

import { getPaletteRandomColor } from '~/src/components/Dataviz/Charts/utils';
import { ChartDataset } from '~/src/types/chart';
import { Bucket, ChartBucket } from '~/src/types/search';

export const buildPieChartDataset = (
  buckets: Bucket[],
  label?: string,
  randomBackgroundColor = true
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  backgroundColor: buckets.map((bucket: ChartBucket) => {
    const paletteColor = get(theme.palette, bucket.backgroundColor!);
    const color =
      typeof paletteColor === 'string'
        ? paletteColor
        : get(paletteColor, 'bright');

    return randomBackgroundColor ? getPaletteRandomColor() : color;
  }),
  borderColor: buckets.map(() => theme.palette.neutral[0]),
  hoverBorderColor: theme.palette.neutral[0],
  labels: buckets.map((bucket) => bucket.key),
  borderWidth: 2,
});
