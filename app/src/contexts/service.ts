import { createContext } from 'react';

import { ApiClient, CurrentUser } from '~/src/utils/api';

export type ServiceContext = {
  api: ApiClient;
  currentUser: CurrentUser;
};
export const ServiceContext = createContext({} as ServiceContext);
