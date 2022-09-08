import { identity, pickBy, toNumber } from 'lodash';

import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';

export const buildQuery = (searchParams: URLSearchParams): SearchBody => {
  const terms = searchParams.getAll('terms');
  const ledgers = searchParams.getAll('ledgers');
  const body = {
    size: searchParams.get('size') ? toNumber(searchParams.get('size')) : 15,
    target: (searchParams.get('target') as SearchTargets) || undefined,
    policy: (searchParams.get('policy') as SearchPolicies) || undefined,
    cursor: searchParams.get('cursor') || undefined,
    terms: terms.length > 0 ? terms : undefined,
    ledgers: ledgers.length > 0 ? ledgers : undefined,
  };

  return pickBy(body, identity) as SearchBody;
};
