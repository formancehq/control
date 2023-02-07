import dayjs from 'dayjs';
import { compact, flatten, omit, sortedUniq } from 'lodash';

import { ObjectOf, theme } from '@numaryhq/storybook';

import { Chart, ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

export const buildLineLabels = (datasets: any): string[] => {
  const labels = sortedUniq(
    flatten(compact(datasets.map((dataset: ChartDataset) => dataset.labels)))
  );
  const uniqLabels = labels.filter(
    (item, index) => labels.indexOf(item) === index
  ) as string[];

  return uniqLabels.map((item: Date | string) =>
    dayjs(item).format('ddd D MMM')
  );
};

export const buildLineChart = (labels: string[], datasets: any): Chart => ({
  labels,
  datasets: compact(
    datasets.map((dataset: ChartDataset) => {
      if (dataset && dataset.data) {
        return omit(dataset, ['labels']);
      }
    })
  ),
});

export const buildLineChartDataset = (
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
