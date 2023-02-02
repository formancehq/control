import dayjs from 'dayjs';
import { compact, flatten, omit, sortedUniq } from 'lodash';

import { ChartDataset, LineChart } from '~/src/types/chart';
import { SearchTargets } from '~/src/types/search';

export const buildLinePayloadQuery = (
  dateFieldName: string,
  target: SearchTargets,
  ledger?: string,
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
  ];

  if (ledger) {
    filters.push({
      match_phrase: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledger: ledger,
      },
    });
  }

  const payload = {
    aggs: {
      line: {
        date_histogram: {
          field: dateFieldName,
          calendar_interval: '1h',
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
      },
    },
  };

  return payload;
};

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

export const buildLineChart = (labels: string[], datasets: any): LineChart => ({
  labels,
  datasets: compact(
    datasets.map((dataset: ChartDataset) => {
      if (dataset && dataset.data) {
        return omit(dataset, ['labels']);
      }
    })
  ),
});
