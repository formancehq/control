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

export const getChartOptions = () => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: false,
    },
  },
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
    // {
    //   range: {
    //     [dateFieldName]: {
    //       gte: "now-1d/d",
    //       lte: "now/d",
    //     },
    //   },
    // },
    {
      match_phrase: {
        kind: target,
      },
    },
    ...optFilters,
  ];

  const payload = {
    aggs: {
      line: {
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
