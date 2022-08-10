import {
  AccountBalanceWallet,
  PaymentOutlined,
  SearchOutlined,
  Topic,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import * as React from 'react';
import { FunctionComponent, useCallback, useState } from 'react';
import { LoadingButton, Search, Suggestion } from '@numaryhq/storybook';
import { debounce, get } from 'lodash';
import { API_SEARCH } from '~/src/utils/api';
import { useNavigate } from 'react-router-dom';
import {
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
  getRoute,
  PAYMENT_ROUTE,
} from '~/src/components/Navbar/routes';
import { useTranslation } from 'react-i18next';
import { Account, Transaction } from '~/src/types/ledger';
import { SearchTargets } from '~/src/types/search';
import { Payment } from '~/src/types/payment';
import { getCurrentLedger } from '~/src/utils/localStorage';
import { useService } from '~/src/hooks/useService';

export const normalizeSearch = (
  data: any,
  navigate: any,
  t: any,
  close: () => void
): Suggestion[] => {
  const accounts: Account[] = get(data, SearchTargets.ACCOUNT, []);
  const transactions: Transaction[] = get(data, SearchTargets.TRANSACTION, []);
  const payments: Payment[] = get(data, SearchTargets.PAYMENT, []);
  const currentLedger = getCurrentLedger()!;

  return [
    {
      label: t('pages.ledgers.accounts.title'),
      icon: <AccountBalanceWallet />,
      items: accounts.map((account: Account) => ({
        id: account.address,
        label: account.address,
        onClick: (id) => {
          navigate(getLedgerAccountDetailsRoute(id, currentLedger));
          close();
        },
      })),
    },
    {
      label: t('pages.ledgers.transactions.title'),
      icon: <Topic />,
      items: transactions.map((transaction: Transaction) => ({
        id: transaction.txid,
        label: `000${transaction.txid}`,
        onClick: (id) => {
          navigate(getLedgerTransactionDetailsRoute(id, currentLedger));
          close();
        },
      })),
    },
    {
      label: t('pages.payments.title'),
      icon: <PaymentOutlined />,
      items: payments.map((payment: Payment) => ({
        id: payment.id,
        label: payment.type,
        onClick: (id) => {
          navigate(getRoute(PAYMENT_ROUTE, id));
          close();
        },
      })),
    },
  ];
};

export const SearchSection: FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSuggestions([]);
    setOpen(false);
  };
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { api } = useService();
  const [loading, setLoading] = useState(true);

  const debouncedRequest = useCallback(
    debounce(async (value: string) => {
      const load = await api.postResource<any>(
        API_SEARCH,
        {
          terms: [value],
          size: 3,
        },
        'data'
      );
      if (load) {
        setSuggestions(normalizeSearch(load, navigate, t, handleClose));
        setLoading(false);
      }
    }, 200),
    []
  );

  const handleOnChange = (event: any) => {
    const value = event.target.value;
    if (value.length >= 2) {
      debouncedRequest(value);
    }
  };

  return (
    <Box>
      <LoadingButton
        startIcon={<SearchOutlined />}
        onClick={handleOpen}
        variant="dark"
      />
      <Search
        open={open}
        onChange={handleOnChange}
        onClose={handleClose}
        suggestions={suggestions}
        loading={loading}
      />
    </Box>
  );
};
export default SearchSection;
