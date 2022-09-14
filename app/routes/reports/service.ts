import * as yup from 'yup';

import { IApiClient } from '~/src/utils/api';

export const submit = async (api: IApiClient): Promise<boolean | undefined> =>
  // TODO post call
  true;

export type ReportFormInput = {
  // TODO
};

// TODO
export const reportSchema = yup.object({}).required('required');
