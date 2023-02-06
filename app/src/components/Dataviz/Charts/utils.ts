import { ObjectOf, theme } from '@numaryhq/storybook';

import { ChartDataset } from '~/src/types/chart';
import { Bucket, FilterMatchPhrase, FilterTerms } from '~/src/types/search';

export const buildQueryPayloadFilters = (
  filters: { key: string; value: string }[]
): FilterMatchPhrase[] =>
  filters.map((filter) => ({
    match_phrase: { [filter.key]: filter.value },
  }));

export const buildQueryPayloadShouldTerms = (
  shouldArr: { key: string; value: string | string[] }[]
): FilterTerms[] =>
  shouldArr.map((should) => ({
    terms: { [should.key]: should.value },
  }));

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
