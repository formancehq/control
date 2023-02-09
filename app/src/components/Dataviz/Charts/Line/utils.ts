import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { compact, flatten, omit, sortedUniq } from 'lodash';

import { ObjectOf, theme } from '@numaryhq/storybook';

import { getPaletteRandomColor } from '~/src/components/Dataviz/Charts/utils';
import { Chart, ChartDataset } from '~/src/types/chart';
import { Bucket } from '~/src/types/search';

dayjs.extend(localizedFormat);

export const buildLineLabels = (
  datasets: any,
  format = 'ddd D MMM'
): string[] => {
  const labels = sortedUniq(
    flatten(compact(datasets.map((dataset: ChartDataset) => dataset.labels)))
  );
  const uniqLabels = labels.filter(
    (item, index) => labels.indexOf(item) === index
  ) as string[];

  return uniqLabels.map((item: Date | string) => dayjs(item).format(format));
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
): ChartDataset | ObjectOf<any> => ({
  label,
  data: buckets.map((bucket) => bucket.doc_count),
  borderColor: getPaletteRandomColor(),
  backgroundColor: theme.palette.neutral[0],
  labels: buckets.map((bucket) => bucket.key_as_string),
});
