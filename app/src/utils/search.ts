import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';
import { identity, isString, pickBy, toNumber } from 'lodash';

export const buildQuery = (searchParams: URLSearchParams): SearchBody => {
  const body = {
    size: searchParams.get('size') ? toNumber(searchParams.get('size')) : 15,
    target: (searchParams.get('target') as SearchTargets) || undefined,
    ledgers: isString(searchParams.get('ledgers'))
      ? ([searchParams.get('ledgers')] as string[])
      : undefined,
    policy: (searchParams.get('policy') as SearchPolicies) || undefined,
    cursor: searchParams.get('cursor') || undefined,
    terms: searchParams.getAll('terms'),
  };

  return pickBy(body, identity) as SearchBody;
};
