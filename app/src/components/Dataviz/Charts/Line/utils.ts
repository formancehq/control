import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { get } from 'lodash';

import { ObjectOf, theme } from '@numaryhq/storybook';

import { getPaletteRandomColor } from '~/src/components/Dataviz/Charts/utils';
import { ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

dayjs.extend(localizedFormat);

export const handleMultilineColor = (list: string[], index: number) => {
  const colorMap = [
    'yellow.bright',
    'violet.bright',
    'blue.bright',
    'brown.bright',
  ];
  const colorSecondaryMap = [
    ...colorMap,
    'yellow.light',
    'violet.light',
    'blue.light',
    'brown.light',
  ];
  if (list.length > 8) {
    return getPaletteRandomColor();
  }

  return get(theme.palette, colorSecondaryMap[index]);
};

export const buildLineChartDataset = (
  buckets: Bucket[],
  label?: string,
  borderColor?: string
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  borderColor: borderColor ? borderColor : theme.palette.neutral[700],
  backgroundColor: theme.palette.neutral[0],
  labels: buckets.map((bucket) => bucket.key_as_string),
});
