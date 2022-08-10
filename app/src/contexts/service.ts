import { createContext } from 'react';
import { IApiClient } from '~/src/utils/api';

export type ServiceContext = {
  api: IApiClient;
};
export const ServiceContext = createContext({} as ServiceContext);
