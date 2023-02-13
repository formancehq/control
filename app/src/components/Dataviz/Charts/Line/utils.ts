import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { ObjectOf, theme } from '@numaryhq/storybook';

import { getPaletteRandomColor } from '~/src/components/Dataviz/Charts/utils';
import { ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

dayjs.extend(localizedFormat);

export const buildLineChartDataset = (
  buckets: Bucket[],
  label?: string
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  borderColor: getPaletteRandomColor(),
  backgroundColor: theme.palette.neutral[0],
  labels: buckets.map((bucket) => bucket.key_as_string),
});
