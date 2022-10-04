import * as React from "react";

import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";

import { Page } from "@numaryhq/storybook";

import { payments as paymentsConfig } from "~/src/components/Navbar/routes";
import ComponentErrorBoundary from "~/src/components/Wrappers/ComponentErrorBoundary";
import PaymentList from "~/src/components/Wrappers/Lists/PaymentList";
import { Filters } from "~/src/components/Wrappers/Table/Filters/filters";
import FiltersBar from "~/src/components/Wrappers/Table/Filters/FiltersBar";
import Select from "~/src/components/Wrappers/Table/Filters/Select";
import Text from "~/src/components/Wrappers/Table/Filters/Text";
import { TableFiltersContext } from "~/src/contexts/tableFilters";
import { Cursor } from "~/src/types/generic";
import {
  Payment,
  PaymentProviders,
  PaymentStatuses,
  PaymentTypes,
} from "~/src/types/payment";
import { SearchPolicies, SearchTargets } from "~/src/types/search";
import { API_SEARCH, ApiClient } from "~/src/utils/api";
import { buildQuery } from "~/src/utils/search";

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
  title: "Payments",
  description: "Show a list",
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const results = await new ApiClient(undefined, request).postResource<
    Cursor<Payment>
  >(
    API_SEARCH,
    {
      ...buildQuery(url.searchParams),
      target: SearchTargets.PAYMENT,
      policy: SearchPolicies.OR,
    },
    "cursor"
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
      <TableFiltersContext.Provider
        value={{
          filters: [
            { field: "type", name: Filters.TERMS },
            { field: "status", name: Filters.TERMS },
            { field: "provider", name: Filters.TERMS },
            { field: "reference", name: Filters.TERMS },
          ],
        }}
      >
        <Form method="get">
          <FiltersBar>
            <>
              <Select
                id="payment-type-autocomplete"
                options={paymentTypes}
                field="type"
                name="payment-type-autocomplete"
                placeholder={t("pages.payments.filters.type")}
              />
              <Select
                id="payment-status-autocomplete"
                options={paymentStatus}
                field="status"
                name="payment-status-autocomplete"
                placeholder={t("pages.payments.filters.status")}
              />
              <Select
                id="payment-provider-autocomplete"
                options={paymentProviders}
                field="provider"
                name="payment-provider-autocomplete"
                placeholder={t("pages.payments.filters.provider")}
              />
              <Text
                placeholder={t("pages.payments.filters.reference")}
                name="reference"
              />
              {/* TODO uncomment when Search API is ready to filter on initialAmount*/}
              {/* https://linear.app/formance/issue/NUM-778/search-minor-improvements-searchable-field-empty-data*/}
              {/*<Text*/}
              {/*  placeholder={t('pages.payments.filters.value')}*/}
              {/*  name="initialAmount"*/}
              {/*/>*/}
            </>
          </FiltersBar>
          <PaymentList payments={payments} />
        </Form>
      </TableFiltersContext.Provider>
    </Page>
  );
}
