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
import {
  Payment,
  PaymentProviders,
  PaymentStatuses,
  PaymentTypes,
} from '~/src/types/payment';
import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import { payments as paymentsConfig } from '~/src/components/Navbar/routes';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import { Cursor } from '~/src/types/generic';
import { buildQuery } from '~/src/utils/search';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import {
  buildOptions,
  renderOption,
} from '~/src/components/Wrappers/Table/Filters/filters';
import FiltersBar from '~/src/components/Wrappers/Table/Filters/FiltersBar';
import Text from '~/src/components/Wrappers/Table/Filters/Text';

const paymentTypes = [PaymentTypes.PAY_IN, PaymentTypes.PAY_OUT];
const paymentProviders = [
  PaymentProviders.STRIPE,
  PaymentProviders.DEVENGO,
  PaymentProviders.MONGOPAY,
  PaymentProviders.WIZE,
  PaymentProviders.PAYPAL,
];
const paymentStatus = [
  PaymentStatuses.PENDING,
  PaymentStatuses.SUCCEEDED,
  PaymentStatuses.FAILED,
  PaymentStatuses.CANCELLED,
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
    renderOption: (props: any, option: AutocompleteOption) =>
      renderOption(props, option),
    style: { width: 250 },
  };

  return (
    <Page id={paymentsConfig.id}>
      <Form method="get">
        <FiltersBar>
          <>
            <AutocompleteSelect
              id="payment-type-autocomplete"
              options={buildOptions(paymentTypes, 'type') as readonly any[]}
              name="payment-type-autocomplete"
              placeholder={t('pages.payments.filters.type')}
              {...props}
            />
            <AutocompleteSelect
              id="payment-status-autocomplete"
              options={buildOptions(paymentStatus, 'status') as readonly any[]}
              name="payment-status-autocomplete"
              placeholder={t('pages.payments.filters.status')}
              {...props}
            />
            <AutocompleteSelect
              id="payment-provider-autocomplete"
              options={
                buildOptions(paymentProviders, 'provider') as readonly any[]
              }
              name="payment-provider-autocomplete"
              placeholder={t('pages.payments.filters.provider')}
              {...props}
            />
            <Text
              placeholder={t('pages.payments.filters.reference')}
              name="reference"
            />
            {/* TODO uncomment when Search API is ready to filter on initialAmount*/}
            {/* https://linear.app/formance/issue/NUM-778/search-add-initialamount-to-searchable-field-payment-target*/}
            {/*<Text*/}
            {/*  placeholder={t('pages.payments.filters.value')}*/}
            {/*  name="initialAmount"*/}
            {/*/>*/}
          </>
        </FiltersBar>
        <PaymentList payments={payments} />
      </Form>
    </Page>
  );
}
