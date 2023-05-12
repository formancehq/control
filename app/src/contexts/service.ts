import { createContext } from 'react';

import { ApiClient, CurrentUser } from '~/src/utils/api';
import { OpenIdConfiguration } from '~/src/utils/auth.server';

export type SnackbarSetter = (message?: string) => void;

export type Metas = {
  origin: string;
  openIdConfig: OpenIdConfiguration;
  api: string;
  membership: string;
};

export type Abilities = {
  shouldRedirectToStackOnboarding: boolean;
};

export type ServiceContext = {
  api: ApiClient;
  currentUser: CurrentUser;
  featuresDisabled: string[];
  metas: Metas;
  abilities: Abilities;
  setService: (service: ServiceContext) => void;
  snackbar: SnackbarSetter;
};
export const ServiceContext = createContext({} as ServiceContext);

export enum FEATURES {
  // Flows nav group
  WORKFLOWS = 'workflows', // flows feature
  INSTANCES = 'instances', // flows feature
  // LEDGERS nav group
  LEDGERS = 'ledgers',
  TRANSACTIONS = 'transactions',
  ACCOUNTS = 'accounts',
  // PAYMENTS nav group
  PAYMENTS = 'payments',
  PAYMENTS_ACCOUNT = 'paymentsAccount',
  WALLETS = 'wallets',
  // CONFIGURATION nav group
  APPS = 'apps',
  O_AUTH_CLIENTS = 'oAuthClients',
  WEBHOOKS = 'webhooks',
  STATUS = 'status',
}
