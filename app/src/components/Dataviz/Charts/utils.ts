import { ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import { compact, flatten, get, omit, sortedUniq } from 'lodash';

import { ObjectOf, theme } from '@numaryhq/storybook';

import { Chart, ChartDataset, ChartTypes } from '~/src/types/chart';
import { BooleanConfig, SearchTargets } from '~/src/types/search';

export const buildQueryPayloadMatchPhrase = (
  filters: { key: string; value: string }[]
): BooleanConfig[] =>
  filters.map((filter) => ({
    match_phrase: { [filter.key]: filter.value },
  }));

export const buildQueryPayloadTerms = (
  shouldArr: { key: string; value: string | string[] }[]
): BooleanConfig[] =>
  shouldArr.map((should) => ({
    terms: { [should.key]: should.value },
  }));

export const getChartOptions = (options?: ChartOptions): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  ...options,
});

export const buildDateHistogramAggs = (field: string, interval = '1h') => ({
  date_histogram: {
    field: field,
    calendar_interval: interval,
    time_zone: 'Europe/Paris',
    min_doc_count: 1,
  },
});

export const buildTermsAggs = (field: string) => ({
  terms: {
    field,
    order: {
      _count: 'desc',
    },
    size: 5,
  },
});

export const buildPayloadQuery = (
  dateFieldName: string,
  aggs: ObjectOf<any>,
  target: SearchTargets,
  optFilters: BooleanConfig[] = [],
  optShould: BooleanConfig[] = [],
  optMust: BooleanConfig[] = [],
  queryOpt?: ObjectOf<any>
) => {
  const filters = [
    {
      match_phrase: {
        kind: target,
      },
    },
    ...optFilters,
  ];

  return {
    aggs: {
      chart: aggs,
    },
    size: 0,
    stored_fields: ['*'],
    docvalue_fields: [
      {
        field: dateFieldName,
        format: 'date_time',
      },
    ],
    query: {
      bool: {
        filter: filters,
        should: optShould,
        must: optMust,
        ...queryOpt,
      },
    },
  };
};

export const buildRange = (
  field: string,
  gte = 'now-12h/h',
  lte = 'now/h'
) => ({
  range: {
    [field]: {
      gte,
      lte,
    },
  },
});

const colors = ['brown', 'yellow', 'primary', 'violet', 'green', 'blue'];
const contrast = ['bright', 'darker'];

export const getRandomColor = (): string =>
  colors[Math.floor(Math.random() * colors.length)];

export const getPaletteRandomColor = (): string =>
  get(get(theme.palette, getRandomColor()), getRandomContrast());

export const getRandomContrast = (): 'bright' | 'normal' | 'darker' =>
  contrast[Math.floor(Math.random() * contrast.length)] as
    | 'bright'
    | 'normal'
    | 'darker';

export const buildChart = (
  labels: (string | Date)[],
  datasets: any,
  reverseDateFormat = 'LT',
  type = ChartTypes.LINE
): Chart => {
  console.log(type);
  if (type === ChartTypes.LINE) {
    datasets.forEach((dataset: ChartDataset) => {
      const dataFormated = labels.map(() => 0);
      dataset.labels.forEach((label: string | Date, index: number) => {
        const myIndex = labels.findIndex(
          (item: string | Date) =>
            dayjs(label).format(reverseDateFormat) === item
        );
        dataFormated[myIndex] = dataset.data[index];
      });
      dataset.data = dataFormated;
    });
  }

  return {
    labels,
    datasets: compact(
      datasets.map((dataset: ChartDataset) => {
        if (dataset && dataset.data) {
          return omit(dataset, ['labels']);
        }
      })
    ),
  };
};

export const buildLabels = (
  datasets: any,
  dateFormat = 'LT'
): (string | Date)[] => {
  const labels = sortedUniq(
    flatten(compact(datasets.map((dataset: ChartDataset) => dataset.labels)))
  );
  const uniqLabels = labels.filter(
    (item, index) => labels.indexOf(item) === index
  ) as string[];

  return uniqLabels
    .sort((a, b) => (dayjs(a) < dayjs(b) ? 1 : -1))
    .reverse()
    .map((item: Date | string) => {
      const date = dayjs(item);
      if (date.isValid()) {
        return date.format(dateFormat);
      }

      return item;
    });
};
