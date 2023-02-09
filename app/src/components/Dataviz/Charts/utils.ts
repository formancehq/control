import { ChartOptions } from 'chart.js';
import { get } from 'lodash';

import { theme } from '@numaryhq/storybook';

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
  ...options,
});

export const buildPayloadQuery = (
  dateFieldName: string,
  target: SearchTargets,
  optFilters: BooleanConfig[] = [],
  optShould: BooleanConfig[] = [],
  optMust: BooleanConfig[] = [],
  interval = '1h'
) => {
  const filters = [
    {
      match_phrase: {
        kind: target,
      },
    },
    ...optFilters,
  ];

  const payload = {
    aggs: {
      chart: {
        date_histogram: {
          field: dateFieldName,
          calendar_interval: interval,
          time_zone: 'Europe/Paris',
          min_doc_count: 1,
        },
      },
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
      },
    },
  };

  return payload;
};

export const buildRange = (field: string, gte = 'now-1d/d', lte = 'now/d') => ({
  range: {
    [field]: {
      gte,
      lte,
    },
  },
});

const colors = ['red', 'brown', 'yellow', 'primary', 'violet', 'green', 'blue'];
const contrast = ['bright', 'normal', 'darker'];

export const getRandomColor = (): string =>
  colors[Math.floor(Math.random() * colors.length)];

export const getPaletteRandomColor = (): string =>
  get(get(theme.palette, getRandomColor()), getRandomContrast());

export const getRandomContrast = (): 'bright' | 'normal' | 'darker' =>
  contrast[Math.floor(Math.random() * contrast.length)] as
    | 'bright'
    | 'normal'
    | 'darker';
