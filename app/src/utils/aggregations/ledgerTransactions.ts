export const ledgerTransactions = (): object => ({
  aggs: {
    history: {
      aggs: {
        split: {
          terms: {
            field: 'indexed.ledger',
            order: {
              _count: 'desc',
            },
            size: 5,
          },
        },
      },
      date_histogram: {
        field: 'indexed.timestamp',
        fixed_interval: '1d',
        time_zone: 'Europe/Paris',
        min_doc_count: 1,
      },
    },
  },
  size: 0,
  stored_fields: ['*'],
  script_fields: {},
  docvalue_fields: [
    {
      field: 'indexed.createdAt',
      format: 'date_time',
    },
    {
      field: 'indexed.timestamp',
      format: 'date_time',
    },
    {
      field: 'when',
      format: 'date_time',
    },
  ],
  _source: {
    excludes: [],
  },
  query: {
    bool: {
      must: [],
      filter: [
        {
          match: {
            kind: 'TRANSACTION',
          },
        },
        {
          range: {
            'indexed.timestamp': {
              gte: '2023-01-01T00:00:00.000Z',
              // "lte": "2023-01-18T00:00:00.000Z",
              format: 'strict_date_optional_time',
            },
          },
        },
      ],
      should: [],
      must_not: [],
    },
  },
});
