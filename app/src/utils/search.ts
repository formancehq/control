import { get, identity, omit, pickBy, toNumber } from 'lodash';

import { SearchBody, SearchPolicies, SearchTargets } from '~/src/types/search';
import { formatTableId } from '~/src/utils/format';

export enum QueryContexts {
  PAYLOAD = 'payload',
  PARAMS = 'params',
}

// TODO new multi list feature should test filters and sorting

export const buildQuery = (
  searchParams: URLSearchParams,
  context: QueryContexts.PARAMS | QueryContexts.PAYLOAD = QueryContexts.PAYLOAD,
  id?: string,
  deserialize = false
): SearchBody | string => {
  const key = formatTableId(id);

  const terms = searchParams.getAll(`${key}terms`);
  const ledgers = searchParams.getAll(`${key}ledgers`);
  const sort = searchParams.getAll(`${key}sort`);

  const body = pickBy(
    {
      [`${key}pageSize`]: searchParams.get(`${key}size`)
        ? toNumber(searchParams.get(`${key}size`))
        : undefined,
      [`${key}target`]:
        (searchParams.get(`${key}target`) as SearchTargets) || undefined,
      [`${key}policy`]:
        (searchParams.get(`${key}policy`) as SearchPolicies) || undefined,
      [`${key}cursor`]: searchParams.get(`${key}cursor`) || undefined,
      [`${key}terms`]: terms.length > 0 ? terms : undefined,
      [`${key}ledgers`]: ledgers.length > 0 ? ledgers : undefined,
      [`${key}sort`]: sort.length > 0 ? sort : undefined,
    },
    identity
  ) as SearchBody;
  if (context === QueryContexts.PAYLOAD) {
    if (deserialize) {
      return Object.keys(body).reduce((acc: any, key: any) => {
        const k = key.split('_')[1];

        return { ...acc, [k]: get(body, key) };
      }, {});
    }

    return body;
  }

  let query = '';
  Object.keys(body).forEach((k: string) => {
    let key = k;
    if (deserialize) {
      key = key.split('_')[1];
    }
    query = `${query}${query.length > 0 ? '&' : ''}${key}=${get(body, k)}`;
  });

  return query;
};

export const sanitizeQuery = (
  request: Request,
  context: QueryContexts.PARAMS | QueryContexts.PAYLOAD = QueryContexts.PAYLOAD,
  id?: string | undefined,
  deserialize = false
): SearchBody | string => {
  const url = new URL(request.url);
  const key = formatTableId(id);
  const query = buildQuery(url.searchParams, context, id, deserialize);
  if (typeof query !== 'string') {
    return {
      ...query,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sort: query[`${key}sort`]
        ? get(query, `${key}sort`, []).map((s: string) => {
            const split = s.split(':');

            return { key: split[0], order: split[1] };
          })
        : undefined,
    } as SearchBody;
  }

  return query as string;
};

export const resetCursor = (query: SearchBody, id?: string): SearchBody => {
  const key = formatTableId(id);

  return omit(query, [`${key}cursor`]);
};
