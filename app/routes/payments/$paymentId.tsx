import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { Page } from '@numaryhq/storybook';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';

export const meta: MetaFunction = () => ({
  title: 'Payment',
  description: 'Show a payment',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="payment"
      title="pages.ledgers.payment.title"
      error={error}
    />
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.paymentId, 'Expected params.paymentId');

  // TODO make a get call and remove mocked data
  // await new ApiClient().getResource<Payment>(
  //   `${API_PAYMENT}/payments/${params.paymentId}`,
  //   'data'
  // );

  // temporary mocked data
  return {
    id: params.paymentId,
  };
};

export default function Index() {
  const payment = useLoaderData();
  const { t } = useTranslation();

  return (
    <Page id="payment" title={t('pages.payment.title')}>
      <Typography>Id : {payment.id}</Typography>
    </Page>
  );
}
