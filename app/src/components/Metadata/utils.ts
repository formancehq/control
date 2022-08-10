import { isEmpty } from 'lodash';
import { ObjectOf } from '~/src/types/generic';
import { Metadata } from '~/src/types/ledger';
import { prettyJson } from '~/src/utils/format';

export const normalizeMetadata = (data: ObjectOf<any>): Metadata[] => {
  if (!isEmpty(data)) {
    return Object.entries(data).map((item: any) => ({
      key: item[0],
      value: prettyJson(item[1]),
    }));
  }

  return [];
};
