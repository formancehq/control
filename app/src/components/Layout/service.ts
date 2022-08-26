import { ObjectOf } from '~/src/types/generic';
import { NavigateFunction } from '@remix-run/react';
import {
  ACCOUNTS_ROUTE,
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
  getRoute,
  PAYMENTS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '~/src/components/Navbar/routes';
import i18n from './../../translations';
import { BreadcrumbsLink } from '@numaryhq/storybook';

const buildPaymentBreadcrumbs = (
  navigate: NavigateFunction,
  id: string
): BreadcrumbsLink[] => [
  {
    label: i18n.t('common.breadcrumbs.targets.payments'),
    onClick: () => navigate(getRoute(PAYMENTS_ROUTE)),
  },
  {
    label: id,
  },
];

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
  navigate: NavigateFunction
): BreadcrumbsLink[] | undefined => {
  const accountsRoute = match('/ledgers/:ledgerId/accounts/:accountId');
  const transactionsRoute = match(
    '/ledgers/:ledgerId/transactions/:transactionId'
  );
  const paymentsRoute = match('/payments/:paymentId');

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
      params.transactionsId,
      params.ledgerId,
      {
        list: getRoute(TRANSACTIONS_ROUTE),
        details: getLedgerTransactionDetailsRoute(
          params.transactionsId,
          params.ledgerId
        ),
      },
      navigate
    );
  }

  if (paymentsRoute) {
    return buildPaymentBreadcrumbs(navigate, params.paymentId);
  }

  return undefined;
};
