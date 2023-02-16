import React from 'react';

import {
  AccountBalance,
  AccountBalanceWallet,
  AccountTree,
  Apps,
  CreditCard,
  Home,
  InsertLink,
  SwapHoriz,
  Wallet,
  Webhook,
  Widgets,
} from '@mui/icons-material';

export const ROOT_ROUTE = '/';
export const OVERVIEW_ROUTE = '/overview';
// Ledgers
export const ACCOUNT_ROUTE = '/ledgers/:slug/accounts/:id';
export const TRANSACTION_ROUTE = '/ledgers/:slug/transactions/:id';
export const ACCOUNTS_ROUTE = '/accounts';
export const TRANSACTIONS_ROUTE = '/transactions';
export const LEDGERS_ROUTE = '/ledgers';
export const LEDGERS_LOGS_ROUTE = '/ledgers/:id/logs';
export const LEDGER_ROUTE = '/ledgers/:id';
// Payments
export const PAYMENTS_ROUTE = '/payments';
export const PAYMENTS_ACCOUNTS_ROUTE = '/payments/accounts';
export const PAYMENT_ROUTE = '/payments/:id';
export const WALLETS_ROUTE = '/wallets';
export const WALLET_ROUTE = '/wallets/:id';
// Configuration
export const OAUTH_CLIENTS_ROUTE = '/connectors/oauth-clients';
export const WEBHOOKS_ROUTE = '/connectors/webhooks';
export const WEBHOOK_ROUTE = '/webhooks/:id';
export const APPS_ROUTE = '/connectors/apps';
export const APP_ROUTE = '/apps/:name';
export const OAUTH_CLIENT_ROUTE = '/oauth-clients/:id';
export const CONNECTORS_ROUTE = APPS_ROUTE;
// TODO uncomment when reco is ready
export const RECON_ROUTE = '/operations/reconciliation';
// TODO uncomment when monitoring is ready
// export const MONITORING_ROUTE = "/monitoring";
export const STATUS_ROUTE = '/status';

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
  paths: string[];
  icon?: React.ReactNode;
  strict?: boolean;
};

export const overview: RouterConfig = {
  id: 'overview',
  label: 'navbar.title.overview',
  paths: [OVERVIEW_ROUTE, ROOT_ROUTE],
  icon: <Home />,
};

// Ledgers
export const accounts: RouterConfig = {
  id: 'accounts',
  label: 'navbar.title.accounts',
  paths: [ACCOUNTS_ROUTE, ACCOUNT_ROUTE],
  icon: <AccountTree />,
};
export const transactions: RouterConfig = {
  id: 'transactions',
  label: 'navbar.title.transactions',
  paths: [TRANSACTIONS_ROUTE, TRANSACTION_ROUTE],
  icon: <SwapHoriz />,
};
export const ledgers: RouterConfig = {
  id: 'ledgers',
  label: 'navbar.title.ledgers',
  paths: [LEDGERS_ROUTE, LEDGER_ROUTE, LEDGERS_LOGS_ROUTE],
  icon: <AccountBalance />,
};

// Payments
export const paymentsAccounts: RouterConfig = {
  id: 'paymentsAccounts',
  label: 'navbar.title.paymentsAccounts',
  paths: [PAYMENTS_ACCOUNTS_ROUTE],
  icon: <AccountBalanceWallet />,
};
export const wallets: RouterConfig = {
  id: 'wallets',
  label: 'navbar.title.wallets',
  paths: [WALLETS_ROUTE, WALLET_ROUTE],
  icon: <Wallet />,
};
export const payments: RouterConfig = {
  id: 'payments',
  label: 'navbar.title.payments',
  paths: [PAYMENTS_ROUTE, PAYMENT_ROUTE],
  icon: <CreditCard />,
};

// Configuration
export const apps: RouterConfig = {
  id: 'apps',
  label: 'navbar.title.apps',
  paths: [APPS_ROUTE, APP_ROUTE],
  icon: <Widgets />,
};
export const oAuthClients: RouterConfig = {
  id: 'oAuthClient',
  label: 'navbar.title.oAuthClients',
  paths: [OAUTH_CLIENTS_ROUTE, OAUTH_CLIENT_ROUTE],
  icon: <Apps />,
};
export const webhooks: RouterConfig = {
  id: 'webhooks',
  label: 'navbar.title.webhooks',
  paths: [WEBHOOKS_ROUTE, WEBHOOK_ROUTE],
  icon: <Webhook />,
};

// Operations
// TODO uncomment when reco is ready
export const reconciliation: RouterConfig = {
  id: 'reconciliation',
  label: 'navbar.title.reconciliation',
  paths: [RECON_ROUTE],
  icon: <InsertLink />,
};

// TODO uncomment when monitoring is ready
// export const monitoring: RouterConfig = {
//   id: 'monitoring',
//   label: 'navbar.title.monitoring',
//   paths: [MONITORING_ROUTE],
//   icon: <CrisisAlert />,
// };

export const routerConfig: { label?: string; children: RouterConfig[] }[] = [
  {
    label: undefined,
    children: [overview],
  },
  {
    label: 'sidebar.ledgers',
    children: [ledgers, transactions, accounts],
  },
  {
    label: 'sidebar.payments',
    children: [payments, paymentsAccounts, wallets],
  },
  // TODO uncomment when reco is ready
  // {
  //   label: 'sidebar.operations',
  //   children: [reconciliation],
  // },
  {
    label: 'sidebar.configuration',
    children: [apps, oAuthClients, webhooks],
  },
];
