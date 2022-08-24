import {
  AccountBalance,
  CreditCard,
  SearchOutlined,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { Chip, LoadingButton, Search, Txid } from '@numaryhq/storybook';
import { SearchTargets } from '~/src/types/search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ACCOUNTS_ROUTE,
  getRoute,
  PAYMENTS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '~/src/components/Navbar/routes';
import { ActionFunction, MetaFunction } from '@remix-run/node';
import { useSubmit } from '@remix-run/react';

const onClick = (id: number | string) => id;
type Suggestion<T> = {
  label?: string;
  viewAll: boolean;
  items: T[] | [];
};

const accounts: Suggestion<any> = {
  viewAll: true,
  items: [
    {
      id: 1,
      label: 'world:000679472',
      ledger: 'main-production',
      onClick,
    },
    {
      id: 2,
      label: 'world:000679473',
      ledger: 'production',
      onClick,
    },
    {
      id: 2,
      label: 'world:000679476',
      ledger: 'production',
      onClick,
    },
  ],
};

const transactions: Suggestion<any> = {
  viewAll: true,
  items: [
    {
      id: 1,
      ledger: 'main-production',
      source: 'world:0006',
      label: '1',
      onClick,
    },
    {
      id: 2,
      ledger: 'production',
      source: 'world:0006',
      label: '2',
      onClick,
    },
    {
      id: 3,
      label: '3',
      ledger: 'production',
      source: 'world:0006',
      onClick,
    },
  ],
};

export const meta: MetaFunction = () => ({
  title: 'Ledgers',
  description: 'Get a list',
});

export const action: ActionFunction = async ({ request }) => {
  console.log('do something');
};

// TODo improve
export const SearchBar: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const submit = useSubmit();

  const handleOnKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      submit(e.target, { replace: true });
    }
  };

  const handleViewAll = (target: SearchTargets, value: string) => {
    const params = `?terms=${value}&target=${target}&size=15`;

    switch (target) {
      case SearchTargets.ACCOUNT:
        return navigate(`${getRoute(ACCOUNTS_ROUTE)}${params}`);
      case SearchTargets.TRANSACTION:
        return navigate(`${getRoute(TRANSACTIONS_ROUTE)}${params}`);
      case SearchTargets.PAYMENT:
        return navigate(`${getRoute(PAYMENTS_ROUTE)}${params}`);
      default:
        return null;
    }
  };

  const renderChildren = (value: string) => (
    <Box
      sx={{
        overflowY: 'auto',
        display: 'flex',
        width: 800,
        mt: 2,
        borderRadius: '4px',
      }}
    >
      {/* Left block */}
      <Box
        p={2}
        sx={{
          width: 60,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: ({ palette }) => palette.neutral[50],
          borderRight: ({ palette }) => `1px solid ${palette.neutral[200]}`,
        }}
      >
        <LoadingButton
          id="ledgers"
          variant="dark"
          startIcon={<AccountBalance />}
          sx={{ width: 50, marginTop: 2 }}
        />
        <LoadingButton
          id="payments"
          variant="stroke"
          startIcon={<CreditCard />}
          sx={{ width: 50, marginTop: 2 }}
        />
      </Box>
      {/* Right block */}
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.neutral[0],
          width: 740,
          height: 400,
          p: 2,
          overflowY: 'auto',
        }}
      >
        <Typography variant="bold">
          {t('common.search.title', { value })}
        </Typography>
        {renderLedger(accounts, SearchTargets.ACCOUNT, value)}
        {renderLedger(transactions, SearchTargets.TRANSACTION, value)}
      </Box>
    </Box>
  );

  const renderLedger = (data: any, target: SearchTargets, value: string) => (
    <Box mt={1}>
      {data.items.map((item: any, index: number) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            paddingTop: 1,
            paddingBottom: 1,
            columnGap: '120px',
          }}
        >
          <Chip
            label={
              target === SearchTargets.ACCOUNT
                ? t('pages.account.title')
                : t('pages.transactions.title')
            }
            color={target === SearchTargets.ACCOUNT ? 'default' : 'blue'}
            variant="square"
          />
          {target === SearchTargets.ACCOUNT ? (
            <Typography>{item.label}</Typography>
          ) : (
            <Box display="inline-flex" alignItems="center">
              <Txid id={item.label} />
              <Typography ml={1}>{item.source}</Typography>
            </Box>
          )}
          <Chip
            label={item.ledger}
            variant="square"
            icon={<AccountBalance fontSize="small" />}
            sx={{ '& .MuiChip-icon': ({ palette }) => palette.neutral[300] }}
          />
        </Box>
      ))}
      {data.viewAll && (
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <LoadingButton
            variant="stroke"
            content={`${t('common.search.viewAll', {
              target: target.toLowerCase(),
            })}s`}
            onClick={() => handleViewAll(target, value)}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      {/* TODo add transparent variant ?*/}
      <LoadingButton
        id="search"
        startIcon={<SearchOutlined />}
        onClick={handleOpen}
        variant="dark"
      />
      <Search
        open={open}
        onKeyDown={handleOnKeyDown}
        onClose={handleClose}
        renderChildren={(value) => renderChildren(value)}
      />
    </Box>
  );
};
export default SearchBar;
