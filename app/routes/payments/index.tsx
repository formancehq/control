import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { AutocompleteSelect, Page } from '@numaryhq/storybook';
import { useTranslation } from 'react-i18next';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Payment, PaymentTypes } from '~/src/types/payment';
import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import { payments as paymentsConfig } from '~/src/components/Navbar/routes';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import { Cursor } from '~/src/types/generic';
import { buildQuery } from '~/src/utils/search';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { Filters } from '~/src/components/Wrappers/Table/Filters/filters';
import SelectCheckbox from '~/src/components/Wrappers/Table/Filters/SelectCheckbox/SelectCheckbox';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import { SelectCheckboxItem } from '~/src/components/Wrappers/Table/Filters/SelectCheckbox/types';

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
    <Page id={paymentsConfig.id}>
      <Form method="get">
        <FiltersBar>
          <AutocompleteSelect
            noOptionsText={t('common.noResults')}
            placeholder={t('pages.payments.filters.type')}
            name="payment-type-autocomplete"
            multiple
            id="payment-type-autocomplete"
            options={paymentTypes as readonly any[]}
            disableCloseOnSelect
            getOptionLabel={(option: SelectCheckboxItem) => option.label}
            renderOption={(props: any, option: SelectCheckboxItem) => (
              <li {...props}>
                <SelectCheckbox value={option.label} name={Filters.TERMS} />
              </li>
            )}
            style={{ width: 200 }}
          />
        </FiltersBar>
        <PaymentList payments={payments} />
      </Form>
    </Page>
  );
}
