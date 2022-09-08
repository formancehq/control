export const ROOT_ROUTE = '/';
export const OVERVIEW_ROUTE = '/overview';
export const ACCOUNT_ROUTE = '/ledgers/:slug/accounts/:id';
export const TRANSACTION_ROUTE = '/ledgers/:slug/transactions/:id';
export const PAYMENTS_ROUTE = '/payments';
export const PAYMENT_ROUTE = '/payments/:id';
export const ACCOUNTS_ROUTE = '/accounts';
export const TRANSACTIONS_ROUTE = '/transactions';
export const REPORTS_ROUTE = '/reports';

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
};

export const overview: RouterConfig = {
  id: 'overview',
  label: 'navbar.title.overview',
  path: [getRoute(OVERVIEW_ROUTE), ROOT_ROUTE],
};

export const payments: RouterConfig = {
  id: 'payments',
  label: 'navbar.title.payments',
  path: getRoute(PAYMENTS_ROUTE),
};

export const accounts: RouterConfig = {
  id: 'accounts',
  label: 'navbar.title.accounts',
  path: getRoute(ACCOUNTS_ROUTE),
};

export const transactions: RouterConfig = {
  id: 'transactions',
  label: 'navbar.title.transactions',
  path: getRoute(TRANSACTIONS_ROUTE),
};

export const reports: RouterConfig = {
  id: 'reports',
  label: 'navbar.title.reports',
  path: getRoute(REPORTS_ROUTE),
};

export const routerConfig: RouterConfig[] = [
  overview,
  payments,
  accounts,
  transactions,
  reports,
];
