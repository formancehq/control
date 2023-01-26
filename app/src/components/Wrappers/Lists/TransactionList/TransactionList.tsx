import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { flatten, get, head, omit } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { TransactionListProps } from './types';

import {
  Amount,
  Chip,
  Date,
  LoadingButton,
  Row,
  SourceDestination,
  Txid,
} from '@numaryhq/storybook';

import {
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
  getRoute,
  TRANSACTIONS_ROUTE,
} from '~/src/components/Layout/routes';
import ShowListAction from '~/src/components/Wrappers/Lists/Actions/ShowListAction';
import Table from '~/src/components/Wrappers/Table';
import { Cursor } from '~/src/types/generic';
import { Transaction, TransactionHybrid } from '~/src/types/ledger';
import { RECO_DEFAULT_LEDGER } from '~/src/types/reco';
import { SearchPolicies, SearchTargets } from '~/src/types/search';

const normalize = (cursor: Cursor<Transaction>): Cursor<Transaction> =>
  ({
    ...cursor,
    data: flatten(
      get(cursor, 'data', []).map((transaction: Transaction) => {
        const postings = get(transaction, 'postings');
        if (postings) {
          return postings.map((posting, index) => ({
            ...posting,
            postingId: index,
            ...omit(transaction, 'postings'),
            ledger: transaction.ledger || RECO_DEFAULT_LEDGER, // Warning, talk about it to backend. Might be dangerous. Temporary fix
          })) as unknown as Transaction[];
        } else {
          return {
            ...transaction,
            ledger: transaction.ledger || RECO_DEFAULT_LEDGER, // Warning, talk about it to backend. Might be dangerous. Temporary fix
          };
        }
      })
    ),
  } as unknown as Cursor<Transaction>);

const TransactionList: FunctionComponent<TransactionListProps> = ({
  transactions,
  withPagination,
  paginationSize = 15,
  showMore = false,
  sortedColumns,
  withAction = true,
  id,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const transactionsNormalized = normalize(transactions);
  const { accountId } = useParams<{
    accountId: string;
  }>();

  const handleAction = (transaction: TransactionHybrid) => {
    // TODO maybe talk about that to backend. Might be dangerous. Temporary workaround
    const ledger = transaction.ledger || RECO_DEFAULT_LEDGER;
    navigate(getLedgerTransactionDetailsRoute(transaction.txid, ledger));
  };

  const handleSourceDestinationAction = (id: string, ledger: string) => {
    // TODO maybe talk about that to backend. Might be dangerous. Temporary workaround
    const currentLedger = ledger || RECO_DEFAULT_LEDGER;
    navigate(getLedgerAccountDetailsRoute(id, currentLedger));
  };

  const handleShowMore = () =>
    navigate(
      `${getRoute(
        TRANSACTIONS_ROUTE
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      )}?terms=${`destination=${accountId!}`}&terms=${`source=${accountId!}`}&target=${
        SearchTargets.TRANSACTION
      }&policy=${SearchPolicies.OR}&size=15`
    );

  return (
    <>
      <Table
        id={id}
        withPagination={withPagination}
        paginationSize={paginationSize}
        items={transactionsNormalized}
        action={withAction}
        columns={[
          {
            key: 'txid',
            label: t('pages.transactions.table.columnLabel.txid'),
            sort: sortedColumns?.includes('txid') || false,
            width: 10,
          },
          {
            key: 'value',
            label: t('pages.transactions.table.columnLabel.value'),
            width: 10,
            sort: sortedColumns?.includes('value') || false,
          },
          {
            key: 'source',
            label: t('pages.transactions.table.columnLabel.source'),
            width: 30,
            sort: sortedColumns?.includes('source') || false,
          },
          {
            key: 'destination',
            label: t('pages.transactions.table.columnLabel.destination'),
            width: 30,
            sort: sortedColumns?.includes('destination') || false,
          },
          {
            key: 'ledger',
            label: t('pages.transactions.table.columnLabel.ledger'),
            width: 10,
            sort: sortedColumns?.includes('ledger') || false,
          },
          {
            key: 'timestamp',
            label: t('pages.transactions.table.columnLabel.date'),
            sort: sortedColumns?.includes('date') || false,
            width: 10,
          },
        ]}
        renderItem={(
          transaction: TransactionHybrid,
          index: number,
          data: TransactionHybrid[]
        ) => {
          const groupedByTxid = data.filter(
            (a: TransactionHybrid) => a.txid === transaction.txid
          );
          const first = head(groupedByTxid) as TransactionHybrid;

          const displayElement =
            first.destination === transaction.destination &&
            first.source === transaction.source &&
            first.txid === transaction.txid;

          const restProps = {
            renderActions: () => (
              <ShowListAction
                onClick={() => handleAction(transaction)}
                id={transaction.txid}
              />
            ),
          };

          const props = withAction ? restProps : {};

          return (
            <Row
              key={index}
              keys={[
                displayElement ? (
                  <Txid id={transaction.txid} key={transaction.txid} />
                ) : (
                  <></>
                ),
                <Amount
                  asset={transaction.asset}
                  key={transaction.txid}
                  amount={transaction.amount}
                />,
                <SourceDestination
                  key={transaction.txid}
                  label={transaction.source}
                  color="blue"
                  onClick={() =>
                    handleSourceDestinationAction(
                      transaction.source,
                      transaction.ledger
                    )
                  }
                />,
                <SourceDestination
                  key={transaction.txid}
                  label={transaction.destination}
                  color="blue"
                  onClick={() =>
                    handleSourceDestinationAction(
                      transaction.destination,
                      transaction.ledger
                    )
                  }
                />,
                <Chip
                  key={index}
                  label={transaction.ledger}
                  variant="square"
                  color="brown"
                />,
                <Date
                  key={transaction.txid}
                  timestamp={transaction.timestamp}
                />,
              ]}
              item={transaction}
              {...props}
            />
          );
        }}
      />
      {showMore && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <LoadingButton
            id="show-more"
            variant="stroke"
            content={t('common.showMore')}
            onClick={handleShowMore}
          />
        </Box>
      )}
    </>
  );
};

export default TransactionList;
