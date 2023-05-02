import { createContext } from 'react';

import { ApiClient, CurrentUser } from '~/src/utils/api';
import { OpenIdConfiguration } from '~/src/utils/auth.server';

export type SnackbarSetter = (message?: string) => void;

export type ServiceContext = {
  api: ApiClient;
  currentUser: CurrentUser;
  metas: {
    origin: string;
    openIdConfig: OpenIdConfiguration;
    api: string;
  };
  snackbar: SnackbarSetter;
};
export const ServiceContext = createContext({} as ServiceContext);
