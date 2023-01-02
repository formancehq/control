import { identity, omit, pickBy, toNumber } from 'lodash';

import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';

export const buildQuery = (searchParams: URLSearchParams): SearchBody => {
  const terms = searchParams.getAll('terms');
  const ledgers = searchParams.getAll('ledgers');
  const sort = searchParams.getAll('sort');
  const body = {
    size: searchParams.get('size') ? toNumber(searchParams.get('size')) : 15,
    target: (searchParams.get('target') as SearchTargets) || undefined,
    policy: (searchParams.get('policy') as SearchPolicies) || undefined,
    cursor: searchParams.get('cursor') || undefined,
    terms: terms.length > 0 ? terms : undefined,
    ledgers: ledgers.length > 0 ? ledgers : undefined,
    sort: sort.length > 0 ? sort : undefined,
  };

  return pickBy(body, identity) as SearchBody;
};

export const sanitizeQuery = (request: Request) => {
  const url = new URL(request.url);
  const query = buildQuery(url.searchParams);
  const { sort } = query;

  return {
    ...query,
    sort: sort
      ? sort.map((s: string) => {
          const split = s.split(':');

          return { key: split[0], order: split[1] };
        })
      : undefined,
  };
};

export const resetCursor = (query: SearchBody): SearchBody =>
  omit(query, ['cursor']);
