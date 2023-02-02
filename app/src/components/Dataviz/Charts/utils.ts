import { ObjectOf, theme } from '@numaryhq/storybook';

import { ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

export const buildDataset = (
  buckets: Bucket[],
  label?: string
): ChartDataset | ObjectOf<any> => {
  let dataset = {};
  buckets.forEach((bucket, i) => {
    const hue = 140 + (i * 200) / buckets.length;
    const saturation = 60 + (i * 30) / buckets.length;
    const lightness = 40 + (i * 50) / buckets.length;

    dataset = {
      label,
      data: buckets.map((bucket) => bucket.doc_count),
      borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`,
      backgroundColor: theme.palette.neutral[0],
      labels: buckets.map((bucket) => bucket.key_as_string),
    };
  });

  return dataset;
};
