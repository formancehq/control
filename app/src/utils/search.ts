import { identity, omit, pickBy, toNumber } from 'lodash';

import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';

export enum QueryContexts {
  PAYLOAD = 'payload',
  PARAMS = 'params',
}

export const buildQuery = (
  searchParams: URLSearchParams,
  context: QueryContexts.PARAMS | QueryContexts.PAYLOAD = QueryContexts.PAYLOAD
): SearchBody | string => {
  const terms = searchParams.getAll('terms');
  const ledgers = searchParams.getAll('ledgers');
  const sort = searchParams.getAll('sort');
  const body = pickBy(
    {
      size: searchParams.get('size') ? toNumber(searchParams.get('size')) : 15,
      target: (searchParams.get('target') as SearchTargets) || undefined,
      policy: (searchParams.get('policy') as SearchPolicies) || undefined,
      cursor: searchParams.get('cursor') || undefined,
      terms: terms.length > 0 ? terms : undefined,
      ledgers: ledgers.length > 0 ? ledgers : undefined,
      sort: sort.length > 0 ? sort : undefined,
    },
    identity
  ) as SearchBody;

  if (context === QueryContexts.PAYLOAD) {
    return body;
  }

  return `cursor=${body.cursor}&size=${body.size}`;
};

export const sanitizeQuery = (
  request: Request,
  context: QueryContexts.PARAMS | QueryContexts.PAYLOAD = QueryContexts.PAYLOAD
): SearchBody | string => {
  const url = new URL(request.url);
  const query = buildQuery(url.searchParams, context);

  if (typeof query !== 'string') {
    const { sort } = query;

    return {
      ...query,
      sort: sort
        ? sort.map((s: string) => {
            const split = s.split(':');

            return { key: split[0], order: split[1] };
          })
        : undefined,
    } as SearchBody;
  }

  return query as string;
};

export const resetCursor = (query: SearchBody): SearchBody =>
  omit(query, ['cursor']);
