import { NavigateFunction } from '@remix-run/react';

import i18n from './../../translations';

import { BreadcrumbsLink } from '@numaryhq/storybook';

import {
  ACCOUNTS_ROUTE,
  APPS_ROUTE,
  CONNECTORS_ROUTE,
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
  getRoute,
  LEDGER_ROUTE,
  LEDGERS_ROUTE,
  OAUTH_CLIENTS_ROUTE,
  PAYMENTS_ACCOUNTS_ROUTE,
  PAYMENTS_ROUTE,
  TRANSACTIONS_ROUTE,
  WALLETS_ROUTE,
  WEBHOOKS_ROUTE,
  WORKFLOWS_ROUTE,
} from '~/src/components/Layout/routes';
import { ObjectOf } from '~/src/types/generic';

export type State = {
  provider: string;
  reference: string;
};

const buildPaymentBreadcrumbs = (
  navigate: NavigateFunction,
  id: string,
  urlSearchParams: URLSearchParams
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t('common.breadcrumbs.categories.payments'),
    onClick: () => navigate(getRoute(PAYMENTS_ROUTE)),
  };
  const provider = urlSearchParams.get('provider');
  const reference = urlSearchParams.get('reference');

  if (provider && reference) {
    return [
      bread,
      {
        label: provider,
      },
      {
        label: reference,
      },
    ];
  } else {
    return [bread, { label: id }];
  }
};

const buildLedgerLogsBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t(`common.breadcrumbs.categories.ledgers`),
    onClick: () => navigate(getRoute(LEDGERS_ROUTE)),
  };

  return [
    bread,
    { label: id, onClick: () => navigate(getRoute(LEDGER_ROUTE, id)) },
    {
      label: i18n.t(`common.breadcrumbs.targets.logs`),
    },
  ];
};

const buildSimpleDetailBreadcrumbs = (
  navigate: NavigateFunction,
  id: string,
  category: string,
  path: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t(`common.breadcrumbs.categories.${category}`),
    onClick: () => navigate(path),
  };

  return [bread, { label: id }];
};

const buildOAuthClientBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t('common.breadcrumbs.targets.oAuthClients'),
    onClick: () => navigate(getRoute(OAUTH_CLIENTS_ROUTE)),
  };

  return [
    ...buildIndexBreadcrumbs(
      navigate,
      'connectors',
      getRoute(CONNECTORS_ROUTE),
      i18n.t(`common.breadcrumbs.categories.configuration`)
    ),
    bread,
    {
      label: id,
    },
  ];
};

const buildWebhookBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t('common.breadcrumbs.targets.webhooks'),
    onClick: () => navigate(getRoute(WEBHOOKS_ROUTE)),
  };

  return [
    ...buildIndexBreadcrumbs(
      navigate,
      'connectors',
      getRoute(CONNECTORS_ROUTE),
      i18n.t(`common.breadcrumbs.categories.configuration`)
    ),
    bread,
    {
      label: id,
    },
  ];
};

const buildAppBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t('common.breadcrumbs.targets.apps'),
    onClick: () => navigate(getRoute(APPS_ROUTE)),
  };

  return [
    ...buildIndexBreadcrumbs(
      navigate,
      'connectors',
      getRoute(CONNECTORS_ROUTE),
      i18n.t(`common.breadcrumbs.categories.configuration`)
    ),
    bread,
    {
      label: id,
    },
  ];
};

const buildWorkflowBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => [
  ...buildIndexBreadcrumbs(
    navigate,
    'workflows',
    WORKFLOWS_ROUTE,
    i18n.t('common.breadcrumbs.categories.flows')
  ),
  {
    label: id,
  },
];

const buildIndexBreadcrumbs = (
  navigate: NavigateFunction,
  target: string,
  route: string,
  category: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t(`common.breadcrumbs.targets.${target}`),
    onClick: () => navigate(route),
  };

  return [{ label: category }, bread];
};

const buildLedgerBreadcrumbs = (
  target: string,
  id: string,
  ledgerId: string,
  route: { list: string; details: string },
  navigate: any
): BreadcrumbsLink[] => [
  {
    label: i18n.t(`common.breadcrumbs.targets.ledgers`),
    onClick: () => navigate(LEDGERS_ROUTE),
  },
  {
    label: ledgerId,
    onClick: () => navigate(getRoute(LEDGER_ROUTE, ledgerId)),
  },
  {
    label: i18n.t(`common.breadcrumbs.targets.${target}`),
    onClick: () => navigate(route.list),
  },
  {
    label: id,
    onClick: () => {
      navigate(route.details);
    },
  },
];

// TODO improve this shit, make it "smart"
export const breadcrumbsFactory = (
  params: ObjectOf<any>,
  match: (pattern: string) => boolean,
  navigate: NavigateFunction,
  urlSearchParams: URLSearchParams
): BreadcrumbsLink[] | undefined => {
  const accountsRoute = match('/ledgers/:ledgerId/accounts/:accountId');
  const accountsIndex = match('/accounts');
  const transactionsRoute = match(
    '/ledgers/:ledgerId/transactions/:transactionId'
  );
  const transactionsIndex = match('/transactions');
  const flowsIndex = match('/flows/:id');
  const workflowRoute = match('/workflows/:workflowId');
  const connectorsIndex = match('/connectors/:id');
  const oAuthClientRoute = match('/oauth-clients/:oAuthClientId');
  const webhookRoute = match('/webhooks/:webhookId');
  const appRoute = match('/apps/:appName');
  const paymentsIndex = match('/payments');
  const paymentsAccountsIndex = match('/payments/accounts');
  const paymentRoute = match('/payments/:paymentId');
  const walletsIndexRoute = match('/wallets');
  const walletRoute = match('/wallets/:walletId');
  const ledgersIndex = match('/ledgers');
  const ledgerLogsRoute = match('/ledgers/:ledgerId/logs');
  const ledgerRoute = match('/ledgers/:ledgerId');

  if (accountsRoute) {
    return buildLedgerBreadcrumbs(
      'accounts',
      params.accountId,
      params.ledgerId,
      {
        list: getRoute(ACCOUNTS_ROUTE),
        details: getLedgerAccountDetailsRoute(
          params.accountId,
          params.ledgerId
        ),
      },
      navigate
    );
  }

  if (transactionsRoute) {
    return buildLedgerBreadcrumbs(
      'transactions',
      params.transactionId,
      params.ledgerId,
      {
        list: getRoute(TRANSACTIONS_ROUTE),
        details: getLedgerTransactionDetailsRoute(
          params.transactionId,
          params.ledgerId
        ),
      },
      navigate
    );
  }

  if (paymentsAccountsIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'paymentsAccounts',
      getRoute(PAYMENTS_ACCOUNTS_ROUTE),
      i18n.t('common.breadcrumbs.categories.payments')
    );
  }

  if (paymentRoute) {
    return buildPaymentBreadcrumbs(navigate, params.paymentId, urlSearchParams);
  }

  if (ledgerLogsRoute) {
    return buildLedgerLogsBreadcrumbs(navigate, params.ledgerId);
  }

  if (ledgerRoute) {
    return buildSimpleDetailBreadcrumbs(
      navigate,
      params.ledgerId,
      'ledgers',
      LEDGERS_ROUTE
    );
  }

  if (walletRoute) {
    const walletName = params.walletId;

    return buildSimpleDetailBreadcrumbs(
      navigate,
      walletName,
      'wallets',
      WALLETS_ROUTE
    );
  }

  if (walletsIndexRoute) {
    return buildIndexBreadcrumbs(
      navigate,
      'wallets',
      getRoute(WALLETS_ROUTE),
      i18n.t('common.breadcrumbs.categories.wallets')
    );
  }

  if (oAuthClientRoute) {
    return buildOAuthClientBreadcrumbs(navigate, params.oAuthClientId);
  }

  if (webhookRoute) {
    return buildWebhookBreadcrumbs(navigate, params.webhookId);
  }

  if (appRoute) {
    return buildAppBreadcrumbs(navigate, params.appName);
  }

  if (workflowRoute) {
    return buildWorkflowBreadcrumbs(navigate, params.workflowId);
  }

  if (accountsIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'accounts',
      getRoute(ACCOUNTS_ROUTE),
      i18n.t('common.breadcrumbs.categories.ledgers')
    );
  }

  if (transactionsIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'transactions',
      getRoute(TRANSACTIONS_ROUTE),
      i18n.t('common.breadcrumbs.categories.ledgers')
    );
  }

  if (connectorsIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'connectors',
      getRoute(CONNECTORS_ROUTE),
      i18n.t('common.breadcrumbs.categories.configuration')
    );
  }

  if (flowsIndex) {
    return [{ label: i18n.t('common.breadcrumbs.categories.flows') }];
  }

  if (paymentsAccountsIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'paymentsAccounts',
      getRoute(PAYMENTS_ACCOUNTS_ROUTE),
      i18n.t('common.breadcrumbs.categories.payments')
    );
  }

  if (paymentsIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'payments',
      getRoute(PAYMENTS_ROUTE),
      i18n.t('common.breadcrumbs.categories.payments')
    );
  }

  if (ledgersIndex) {
    return buildIndexBreadcrumbs(
      navigate,
      'ledgers',
      getRoute(LEDGERS_ROUTE),
      i18n.t('common.breadcrumbs.categories.ledgers')
    );
  }

  return undefined;
};
