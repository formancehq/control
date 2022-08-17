import * as React from 'react';
import { useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Form, useLoaderData, useSearchParams } from '@remix-run/react';
import { LoadingButton, Page } from '@numaryhq/storybook';
import { useTranslation } from 'react-i18next';
import { LoaderFunction } from '@remix-run/server-runtime';
import {
  ClickAwayListener,
  ListItemText,
  MenuItem,
  Paper,
} from '@mui/material';
import { Payment, PaymentTypes } from '~/src/types/payment';
import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import { payments as paymentsConfig } from '~/src/components/Navbar/routes';
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import { Cursor } from '~/src/types/generic';
import { useOpen } from '~/src/hooks/useOpen';
import {
  ImportExport,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { buildQuery } from '~/src/utils/search';
import SelectCheckbox from '~/src/components/Wrappers/Filters/SelectCheckbox';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { URLSearchParamsInit } from 'react-router-dom';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';

const paymentTypes: { value: string; label: string }[] = [
  { value: `type=${PaymentTypes.PAY_IN}`, label: PaymentTypes.PAY_IN },
  { value: `type=${PaymentTypes.PAY_OUT}`, label: PaymentTypes.PAY_OUT },
];

export const meta: MetaFunction = () => ({
  title: 'Payments',
  description: 'Display payments list !',
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const results = await new ApiClient().postResource<Cursor<Payment>>(
    API_SEARCH,
    {
      ...buildQuery(url.searchParams),
      target: SearchTargets.PAYMENT,
    },
    'cursor'
  );
  if (results) return results;

  return null;
};

export function ErrorBoundary({ error }) {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const payments = useLoaderData();
  const [open, handleOpen, handleClose] = useOpen();

  useEffect(() => {
    setSearchParams({
      ...buildQuery(searchParams),
      target: SearchTargets.PAYMENT,
      policy: SearchPolicies.OR,
    } as URLSearchParamsInit);
  }, []);

  return (
    <Page title={t('pages.payments.title')} id={paymentsConfig.id}>
      <Form method="get">
        <LoadingButton
          content="Payment types"
          variant="dark"
          startIcon={<ImportExport />}
          endIcon={!open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          onClick={handleOpen}
        />
        {open && (
          <ClickAwayListener onClickAway={handleClose}>
            <Paper
              sx={{
                height: 150,
                width: 200,
                position: 'absolute',
                zIndex: 999,
                marginLeft: 0,
              }}
            >
              {paymentTypes.map(({ value, label }, index) => (
                <MenuItem key={index} value={value}>
                  <SelectCheckbox value={value} name="terms" />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Paper>
          </ClickAwayListener>
        )}
        <PaymentList payments={payments} />
      </Form>
    </Page>
  );
}
