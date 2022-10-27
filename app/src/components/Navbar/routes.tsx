import React from 'react';

import { AccountBalance, CreditCard, Home, Share } from '@mui/icons-material';

export const ROOT_ROUTE = '/';
export const OVERVIEW_ROUTE = '/overview';
export const ACCOUNT_ROUTE = '/ledgers/:slug/accounts/:id';
export const TRANSACTION_ROUTE = '/ledgers/:slug/transactions/:id';
export const PAYMENTS_ROUTE = '/payments';
export const PAYMENT_ROUTE = '/payments/:id';
export const OAUTH_CLIENTS_ROUTE = '/connectors/oauth-clients';
export const APPS_ROUTE = '/connectors/apps';
export const OAUTH_CLIENT_ROUTE = '/oauth-clients/:id';
export const ACCOUNTS_ROUTE = '/accounts';
export const TRANSACTIONS_ROUTE = '/transactions';
export const CONNECTORS_ROUTE = APPS_ROUTE;

export const getRoute = (uri: string, id?: number | string): string =>
  id !== undefined ? uri.replace(/:\w+/, id.toString(10)) : uri;

const getLedgerDetails = (
  route: string,
  id: number | string,
  currentLedger: string
) => getRoute(route.replace(/:slug/, currentLedger), id);

export const getLedgerAccountDetailsRoute = (
  id: number | string,
  currentLedger: string
): string => getLedgerDetails(ACCOUNT_ROUTE, id, currentLedger);

export const getLedgerTransactionDetailsRoute = (
  id: number | string,
  currentLedger: string
): string => getLedgerDetails(TRANSACTION_ROUTE, id, currentLedger);

export type RouterConfig = {
  id: any;
  label: string;
  path: string | string[];
  icon?: React.ReactNode;
};

export const overview: RouterConfig = {
  id: 'overview',
  label: 'navbar.title.overview',
  path: [getRoute(OVERVIEW_ROUTE), ROOT_ROUTE],
  icon: <Home />,
};

export const payments: RouterConfig = {
  id: 'payments',
  label: 'navbar.title.payments',
  path: getRoute(PAYMENTS_ROUTE),
  icon: <CreditCard />,
};

export const accounts: RouterConfig = {
  id: 'accounts',
  label: 'navbar.title.accounts',
  path: getRoute(ACCOUNTS_ROUTE),
  icon: <AccountBalance />,
};

export const transactions: RouterConfig = {
  id: 'transactions',
  label: 'navbar.title.transactions',
  path: getRoute(TRANSACTIONS_ROUTE),
  icon: <AccountBalance />,
};

export const connectors: RouterConfig = {
  id: 'connectors',
  label: 'navbar.title.connectors',
  path: [
    getRoute(CONNECTORS_ROUTE),
    getRoute(APPS_ROUTE),
    getRoute(OAUTH_CLIENTS_ROUTE),
  ],
  icon: <Share />,
};

export const routerConfig: RouterConfig[] = [
  overview,
  payments,
  accounts,
  transactions,
  connectors,
];
