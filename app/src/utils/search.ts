import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';
import { identity, isString, pickBy, toNumber } from 'lodash';

export const buildQuery = (searchParams: URLSearchParams): SearchBody => {
  const terms = searchParams.getAll('terms');
  const body = {
    size: searchParams.get('size') ? toNumber(searchParams.get('size')) : 15,
    ledgers: isString(searchParams.get('ledgers'))
      ? ([searchParams.get('ledgers')] as string[])
      : undefined,
    target: (searchParams.get('target') as SearchTargets) || undefined,
    policy: (searchParams.get('policy') as SearchPolicies) || undefined,
    cursor: searchParams.get('cursor') || undefined,
    terms: terms.length > 0 ? terms : undefined,
  };

  return pickBy(body, identity) as SearchBody;
};
