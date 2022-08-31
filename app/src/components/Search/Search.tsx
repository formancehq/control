import {
  AccountBalance,
  CreditCard,
  SearchOutlined,
} from '@mui/icons-material';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  Amount,
  Chip,
  EmptyState,
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
  SuggestionItem,
  TransactionsSuggestions,
} from '~/src/types/search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ACCOUNTS_ROUTE,
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
  getRoute,
  PAYMENT_ROUTE,
  PAYMENTS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '~/src/components/Navbar/routes';
import { useService } from '~/src/hooks/useService';
import {
  getSuggestions,
  suggestionsFactory,
} from '~/src/components/Search/service';
import { get, isEmpty } from 'lodash';
import { useOpen } from '~/src/hooks/useOpen';
import PayInChips from '~/src/components/Wrappers/PayInChips';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';

// TODo improve
const Search: FunctionComponent = () => {
  const [open, handleOpen, handleClose] = useOpen();
  const [loading, load, stopLoading] = useOpen();
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

  const handleOnKeyDown = (e: any) => {
    const value = e.target.value;
    if (e.keyCode === 27) {
      setSuggestions(undefined);
      setValue(undefined);
      handleClose();
    }
    if (value.length > 2) {
      if (e.keyCode === 13) {
        setValue(value);
      }
    }
  };

  const handleOnChange = (e: any) => {
    const value = e.target.value;
    if (isEmpty(value)) {
      setSuggestions(undefined);
    }
  };

  const handleTargetChange = (target: SearchTarget) => {
    setTarget(target);
    setSuggestions(undefined);
  };

  useEffect(() => {
    (async () => {
      if (value) {
        load();
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
                get(accounts, 'total.value')
              ) as AccountSuggestions,
              transactions: suggestionsFactory(
                transactions.data as SearchResource,
                SearchTargets.TRANSACTION,
                get(transactions, 'total.value')
              ) as TransactionsSuggestions,
            } as {
              accounts: AccountSuggestions;
              transactions: TransactionsSuggestions;
            };
            setSuggestions(items);
            stopLoading();
          }
        } else {
          const results = await getSuggestions(target, value, api);
          if (results && results.data && target)
            setSuggestions(
              suggestionsFactory(
                results.data as SearchResource,
                target,
                get(results, 'total.value')
              )
            );
          stopLoading();
        }
      }
    })();
  }, [value, target]);

  const handleViewAll = (target: SearchTargets, value: string) => {
    const params = `?terms=${value}&target=${target}&size=15`;
    handleClose();
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

  const handleOnClick = (item: SuggestionItem, target: SearchTarget) => {
    handleClose();
    switch (target) {
      case SearchTargets.ACCOUNT:
        return navigate(
          getLedgerAccountDetailsRoute(item.id, get(item, 'ledger'))
        );
      case SearchTargets.TRANSACTION:
        return navigate(
          getLedgerTransactionDetailsRoute(item.id, get(item, 'ledger'))
        );
      case SearchTargets.PAYMENT:
        return navigate(getRoute(PAYMENT_ROUTE, item.id));
      default:
        return null;
    }
  };

  // TODO improve with target factory instead of multiple conditions
  const renderChildren = (value: string) => {
    const noResults =
      get(
        suggestions,
        'transactions.items',
        get(suggestions, 'accounts.items', get(suggestions, 'items', []))
      ).length === 0;

    return (
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
            width: 800,
            height: 400,
            p: 2,
            overflowY: 'auto',
          }}
        >
          <Typography variant="bold">
            {t('common.search.title', {
              value,
              target: `${t(
                `common.search.targets.${target.toLowerCase()}`
              )}s`.toLowerCase(),
            })}
          </Typography>
          {noResults && !loading && (
            <Box mt={4}>
              <EmptyState
                description={t('common.noResults')}
                title=""
                sx={{ border: 0 }}
              />
            </Box>
          )}
          {loading && (
            <Box mt={1} display="flex" justifyContent="center">
              <CircularProgress size="24px" />
            </Box>
          )}

          {suggestions && (
            <>
              {/* TODO avoid lodash get cheat for wrong type*/}
              {target === SearchTargets.LEDGER && (
                <>
                  {renderSuggestion(
                    get(suggestions, 'accounts'),
                    SearchTargets.ACCOUNT,
                    value
                  )}
                  {renderSuggestion(
                    get(suggestions, 'transactions'),
                    SearchTargets.TRANSACTION,
                    value
                  )}
                </>
              )}
              {target !== SearchTargets.LEDGER && (
                <>{renderSuggestion(suggestions, target, value)}</>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  };

  //todo type
  const renderSuggestion = (data: any, target: SearchTarget, value: string) => (
    <Box mt={3}>
      {data.items.map((item: any, index: number) => (
        <Grid
          container
          key={index}
          onClick={() => handleOnClick(item, target)}
          p={1}
          sx={{
            cursor: 'pointer',
            ':hover': {
              background: ({ palette }) => palette.neutral[50],
              borderRadius: '4px',
            },
          }}
        >
          <Grid item xs={3}>
            {target === SearchTargets.PAYMENT ? (
              <PayInChips key={index} type={item.type} />
            ) : (
              <Chip
                label={data.targetLabel}
                color={target === SearchTargets.ACCOUNT ? 'default' : 'blue'}
                variant="square"
              />
            )}
          </Grid>
          <Grid item xs={5}>
            {item.source ? (
              <Box display="inline-flex" alignItems="center">
                <Txid id={item.label} />
                <Typography ml={1}>{item.source}</Typography>
              </Box>
            ) : (
              <Typography>{item.label}</Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            {item.ledger && (
              <Chip
                label={item.ledger}
                variant="square"
                icon={<AccountBalance fontSize="small" />}
                sx={{
                  '& .MuiChipIcon': ({ palette }) => palette.neutral[300],
                  display: 'flex',
                  float: 'right',
                }}
              />
            )}
            {item.provider && (
              <Box display="flex" alignItems="center">
                <ProviderPicture provider={item.provider} />
                <Box ml={6}>
                  <Amount amount={item.amount} asset={item.asset} />
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      ))}

      {data.viewAll && (
        <Box display="flex" justifyContent="center" mt={2} mb={4}>
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
      <LoadingButton
        id="trigger-search"
        startIcon={<SearchOutlined />}
        onClick={handleOpen}
        variant="transparent"
        sx={{ color: ({ palette }) => palette.neutral[0] }}
      />
      <SbSearch
        open={open}
        placeholder={t('common.search.placeholder')}
        name="terms"
        required={true}
        onKeyDown={handleOnKeyDown}
        onChange={handleOnChange}
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
