import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Page } from '@numaryhq/storybook';
import { useTranslation } from 'react-i18next';
import { LoaderFunction } from '@remix-run/server-runtime';
import { MenuItem } from '@mui/material';
import { Payment, PaymentTypes } from '~/src/types/payment';
import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import { payments as paymentsConfig } from '~/src/components/Navbar/routes';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import { Cursor } from '~/src/types/generic';
import { buildQuery } from '~/src/components/Wrappers/Search/search';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { Filters } from '~/src/components/Wrappers/Search/Filters/filters';
import SelectCheckbox from '~/src/components/Wrappers/Search/Filters/SelectCheckbox/SelectCheckbox';
import SelectButton from '~/src/components/Wrappers/Search/Filters/SelectButton';

const paymentTypes: { value: string; label: string }[] = [
  { value: `type=${PaymentTypes.PAY_IN}`, label: PaymentTypes.PAY_IN },
  { value: `type=${PaymentTypes.PAY_OUT}`, label: PaymentTypes.PAY_OUT },
];

export const meta: MetaFunction = () => ({
  title: 'Payments',
  description: 'Show a list',
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const results = await new ApiClient().postResource<Cursor<Payment>>(
    API_SEARCH,
    {
      ...buildQuery(url.searchParams),
      target: SearchTargets.PAYMENT,
      policy: SearchPolicies.OR,
    },
    'cursor'
  );
  if (results) return results;

  return null;
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={paymentsConfig.id}
      title="pages.payments.title"
      error={error}
    />
  );
}

export default function Index() {
  const { t } = useTranslation();
  const payments = useLoaderData();

  return (
    <Page title={t('pages.payments.title')} id={paymentsConfig.id}>
      <Form method="get">
        <SelectButton label={t('pages.payments.filters.type')}>
          <>
            {paymentTypes.map(({ label, value }, index) => (
              <MenuItem key={index} value={label}>
                <SelectCheckbox
                  value={value}
                  name={Filters.LEDGERS}
                  label={label}
                />
              </MenuItem>
            ))}
          </>
        </SelectButton>
        <PaymentList payments={payments} />
      </Form>
    </Page>
  );
}
