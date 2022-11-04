import * as yup from 'yup';

import i18n from '../../../translations';

import { ObjectOf } from '~/src/types/generic';
import { LedgerResources, LedgerSubResources } from '~/src/types/ledger';
import { API_LEDGER, ApiClient } from '~/src/utils/api';

export const prettyJson = (json: JSON | ObjectOf<any>): string =>
  JSON.stringify(json, undefined, 4);

export const submit = async (
  json: string,
  id: string,
  resource: LedgerResources.TRANSACTIONS | LedgerResources.ACCOUNTS,
  ledger: string,
  api: ApiClient
): Promise<void | undefined | boolean> =>
  await api.postResource<boolean>(
    `${API_LEDGER}/${ledger}/${resource}/${id}/${LedgerSubResources.METADATA}`,
    json
  );

export type FormInput = {
  json: string;
};

export const schema = yup
  .object({
    json: yup
      .mixed()
      .test(
        'json',
        i18n.t('common.forms.metadata.json.errors.valid'),
        (value) => {
          try {
            JSON.parse(value);

            return true;
          } catch (e) {
            return false;
          }
        }
      ),
  })
  .required(i18n.t('common.forms.metadata.json.errors.valid'));
