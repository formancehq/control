import { ChartDataset } from 'chart.js';
import _ from 'lodash';

type BucketData = {
  key_as_string?: string;
  key: number | string;
  doc_count: number;
  split?: AggregationData;
};

export type AggregationData = {
  buckets: Array<BucketData>;
  [key: string]: any;
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

export const toBarChart = (data: AggregationData): ChartData => {
  const labels: string[] = data.buckets.map((bucket) => {
    const date = new Date(bucket.key_as_string || bucket.key);

    return date.toLocaleDateString();
  });
  const series: string[] = [];
  _(data.buckets)
    .map((bucket) => bucket.split?.buckets.map((split) => `${split.key}`))
    .flatten()
    .uniq()
    .each((e) => {
      series.push(e as string);
    });

  const colors = series.map((e, i) => {
    // hue should be in the blueish greenish range
    const hue = 140 + (i * 200) / series.length;
    const saturation = 60 + (i * 30) / series.length;
    const lightness = 40 + (i * 50) / series.length;

    return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
  });

  const datasets: ChartDataset[] = series.map((e) => ({
    label: e,
    data: data.buckets.map((bucket) => {
      const split = bucket.split?.buckets.find((split) => split.key === e);

      return split?.doc_count || 0;
    }),
    // borderColor: colors[series.indexOf(e)],
    // borderWidth: 1,
    barThickness: 8,
    backgroundColor: colors[series.indexOf(e)].replace('1)', '1)'),
    borderRadius: 6,
  }));
  console.log({ labels, datasets });

  return {
    labels,
    datasets,
  };
};
