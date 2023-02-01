import { theme } from '@numaryhq/storybook';

import { Bucket, SearchTargets } from '~/src/types/search';

export const buildLinePayloadQuery = (
  dateFieldName: string,
  target: SearchTargets,
  ledger: string
) => ({
  aggs: {
    line: {
      date_histogram: {
        field: 'indexed.timestamp',
        fixed_interval: '3h',
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
      filter: [
        {
          range: {
            [dateFieldName]: {
              gte: 'now-1d/d',
              lte: 'now/d',
            },
          },
        },
        {
          match_phrase: {
            kind: target,
          },
        },
        {
          match_phrase: {
            ledger: ledger,
          },
        },
      ],
    },
  },
});

export const getDataset = (buckets: Bucket[], ledger: string) => {
  let dataset = {};
  buckets.forEach((bucket, i) => {
    const hue = 140 + (i * 200) / buckets.length;
    const saturation = 60 + (i * 30) / buckets.length;
    const lightness = 40 + (i * 50) / buckets.length;

    dataset = {
      label: ledger,
      data: buckets.map((bucket) => bucket.doc_count),
      borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`,
      backgroundColor: theme.palette.neutral[0],
    };
  });

  return dataset;
};
