import { API_LEDGER, IApiClient } from '~/src/utils/api';
import { getCurrentLedger } from '~/src/utils/localStorage';
import { LedgerResources, LedgerSubResources } from '~/src/types/ledger';
import * as yup from 'yup';
import i18n from '../../../translations';

export const prettyJson = (json: JSON): string =>
  JSON.stringify(json, undefined, 4);

export const submit = async (
  json: string,
  id: string,
  resource: LedgerResources.TRANSACTIONS | LedgerResources.ACCOUNTS,
  api: IApiClient
): Promise<boolean> =>
  await api.postResource<boolean>(
    `${API_LEDGER}/${getCurrentLedger()}/${resource}/${id}/${
      LedgerSubResources.METADATA
    }`,
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