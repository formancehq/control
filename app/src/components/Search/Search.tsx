import {
  AccountBalance,
  CreditCard,
  SearchOutlined,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  Chip,
  LoadingButton,
  Search as SbSearch,
  Txid,
} from '@numaryhq/storybook';
import {
  AccountSuggestions,
  PaymentSuggestions,
  SearchResource,
  SearchTarget,
  SearchTargets,
  TransactionsSuggestions,
} from '~/src/types/search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ACCOUNTS_ROUTE,
  getRoute,
  PAYMENTS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '~/src/components/Navbar/routes';
import { useService } from '~/src/hooks/useService';
import {
  getSuggestions,
  suggestionsFactory,
} from '~/src/components/Search/service';
import { get } from 'lodash';

// TODo improve
const Search: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>();
  const [target, setTarget] = useState<SearchTarget>(SearchTargets.LEDGER);
  const [suggestions, setSuggestions] = useState<
    | AccountSuggestions
    | TransactionsSuggestions
    | PaymentSuggestions
    | {
        accounts: AccountSuggestions;
        transactions: TransactionsSuggestions;
      }
  >();
  const { api } = useService();

  // TODO remove when Search storybook component will not be wrapped by a form
  const handleOnChange = (e: any) => {
    const value = e.target.value;
    if (value.length > 2) {
      setValue(value);
    }
  };
  // TODO uncomment when Search storybook component will not be wrapped by a form
  // const handleOnKeyDown = (e: any) => {
  //   const value = e.target.value;
  //   if (value.length > 2) {
  //     if (e.keyCode === 13) {
  //       setValue(value);
  //     }
  //   }
  // };

  const handleTargetChange = (target: SearchTarget) => {
    setTarget(target);
  };

  useEffect(() => {
    (async () => {
      if (value) {
        if (target === SearchTargets.LEDGER) {
          const accounts = await getSuggestions(
            SearchTargets.ACCOUNT,
            value,
            api
          );
          const transactions = await getSuggestions(
            SearchTargets.TRANSACTION,
            value,
            api
          );
          if (accounts && transactions && accounts.data && transactions.data) {
            const items = {
              accounts: suggestionsFactory(
                accounts.data as SearchResource,
                SearchTargets.ACCOUNT,
                accounts.total.value
              ) as AccountSuggestions,
              transactions: suggestionsFactory(
                transactions.data as SearchResource,
                SearchTargets.TRANSACTION,
                transactions.total.value
              ) as TransactionsSuggestions,
            } as {
              accounts: AccountSuggestions;
              transactions: TransactionsSuggestions;
            };
            setSuggestions(items);
          }
        } else {
          const results = await getSuggestions(target, value, api);
          if (results && results.data && target)
            setSuggestions(
              suggestionsFactory(
                results.data as SearchResource,
                target,
                results.total.value
              )
            );
        }
      }
    })();
  }, [value, target]);

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
        {/* Target nav goes here*/}
        <LoadingButton
          id="ledgers"
          variant={target === SearchTargets.LEDGER ? 'dark' : 'stroke'}
          startIcon={<AccountBalance />}
          sx={{ width: 50, marginTop: 2 }}
          onClick={() => handleTargetChange(SearchTargets.LEDGER)}
        />
        <LoadingButton
          id="payments"
          variant={target === SearchTargets.PAYMENT ? 'dark' : 'stroke'}
          startIcon={<CreditCard />}
          sx={{ width: 50, marginTop: 2 }}
          onClick={() => handleTargetChange(SearchTargets.PAYMENT)}
        />
        {/* TODO add more such as report, reco, webhook...and so many more :D*/}
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
        {suggestions && (
          <>
            {/* TODO avoid lodash get cheat for wrong type*/}
            {renderLedger(
              get(suggestions, 'accounts'),
              SearchTargets.ACCOUNT,
              value
            )}
            {renderLedger(
              get(suggestions, 'transactions'),
              SearchTargets.TRANSACTION,
              value
            )}
          </>
        )}
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
    <>
      {/* TODo add transparent variant ?*/}
      <LoadingButton
        id="trigger-search"
        startIcon={<SearchOutlined />}
        onClick={handleOpen}
        variant="dark"
      />
      <SbSearch
        open={open}
        onChange={handleOnChange}
        // onKeyDown={handleOnKeyDown}
        onClose={handleClose}
        renderChildren={(value) => {
          if (value) {
            return renderChildren(value);
          }

          return <></>;
        }}
      />
    </>
  );
};
export default Search;
