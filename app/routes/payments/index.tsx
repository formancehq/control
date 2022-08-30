import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import {
  AutocompleteOption,
  AutocompleteSelect,
  Page,
} from '@numaryhq/storybook';
import { useTranslation } from 'react-i18next';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Payment, PaymentStatuses, PaymentTypes } from '~/src/types/payment';
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

const paymentTypes: AutocompleteOption[] = [
  { id: `type=${PaymentTypes.PAY_IN}`, label: PaymentTypes.PAY_IN },
  { id: `type=${PaymentTypes.PAY_OUT}`, label: PaymentTypes.PAY_OUT },
];

const paymentStatus: AutocompleteOption[] = [
  { id: `status=${PaymentStatuses.PENDING}`, label: PaymentStatuses.PENDING },
  {
    id: `status=${PaymentStatuses.SUCCEEDED}`,
    label: PaymentStatuses.SUCCEEDED,
  },
  { id: `status=${PaymentStatuses.FAILED}`, label: PaymentStatuses.FAILED },
  {
    id: `status=${PaymentStatuses.CANCELLED}`,
    label: PaymentStatuses.CANCELLED,
  },
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
  const props = {
    noOptionsText: t('common.noResults'),
    multiple: true,
    disableCloseOnSelect: true,
    getOptionLabel: (option: AutocompleteOption) => option.label,
    renderOption: (props: any, option: AutocompleteOption) => (
      <li {...props}>
        <SelectCheckbox value={option.label} name={Filters.TERMS} />
      </li>
    ),
    style: { width: 250 },
  };

  return (
    <Page id={paymentsConfig.id}>
      <Form method="get">
        <FiltersBar>
          <>
            <AutocompleteSelect
              id="payment-type-autocomplete"
              options={paymentTypes as readonly any[]}
              name="payment-type-autocomplete"
              placeholder={t('pages.payments.filters.type')}
              {...props}
            />
            <AutocompleteSelect
              id="payment-status-autocomplete"
              options={paymentStatus as readonly any[]}
              name="payment-status-autocomplete"
              placeholder={t('pages.payments.filters.status')}
              {...props}
            />
          </>
        </FiltersBar>
        <PaymentList payments={payments} />
      </Form>
    </Page>
  );
}
