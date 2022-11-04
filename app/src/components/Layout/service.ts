import { NavigateFunction } from '@remix-run/react';

import i18n from './../../translations';

import { BreadcrumbsLink } from '@numaryhq/storybook';

import {
  ACCOUNTS_ROUTE,
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
  getRoute,
  OAUTH_CLIENTS_ROUTE,
  PAYMENTS_ROUTE,
  TRANSACTIONS_ROUTE,
  WEBHOOKS_ROUTE,
} from '~/src/components/Navbar/routes';
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
    label: i18n.t('common.breadcrumbs.targets.payments'),
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

const buildOAuthClientBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => {
  const bread = {
    label: i18n.t('common.breadcrumbs.targets.oAuthClients'),
    onClick: () => navigate(getRoute(OAUTH_CLIENTS_ROUTE)),
  };

  return [
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
    bread,
    {
      label: id,
    },
  ];
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
  },
  {
    label: ledgerId,
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

export const breadcrumbsFactory = (
  params: ObjectOf<any>,
  match: (pattern: string) => boolean,
  navigate: NavigateFunction,
  urlSearchParams: URLSearchParams
): BreadcrumbsLink[] | undefined => {
  const accountsRoute = match('/ledgers/:ledgerId/accounts/:accountId');
  const transactionsRoute = match(
    '/ledgers/:ledgerId/transactions/:transactionId'
  );
  const paymentsRoute = match('/payments/:paymentId');
  const oAuthClientsRoute = match('/oauth-clients/:oAuthClientId');
  const webhooksRoute = match('/webhooks/:webhookId');

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

  if (paymentsRoute) {
    return buildPaymentBreadcrumbs(navigate, params.paymentId, urlSearchParams);
  }
  if (oAuthClientsRoute) {
    return buildOAuthClientBreadcrumbs(navigate, params.oAuthClientId);
  }
  if (webhooksRoute) {
    return buildWebhookBreadcrumbs(navigate, params.webhookId);
  }

  return undefined;
};
