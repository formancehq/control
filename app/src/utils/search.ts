import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';
import { toInt } from 'radash';
import { identity, pickBy } from 'lodash';

export const buildQuery = (searchParams: URLSearchParams): SearchBody => {
  const terms = searchParams.getAll('terms');
  const ledgers = searchParams.getAll('ledgers');
  const body = {
    size: searchParams.get('size') ? toInt(searchParams.get('size')) : 15,
    target: (searchParams.get('target') as SearchTargets) || undefined,
    policy: (searchParams.get('policy') as SearchPolicies) || undefined,
    cursor: searchParams.get('cursor') || undefined,
    terms: terms.length > 0 ? terms : undefined,
    ledgers: ledgers.length > 0 ? ledgers : undefined,
  };

  return pickBy(body, identity) as SearchBody;
};
