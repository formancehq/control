import { flatten, get, head, omit } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { TransactionListProps } from './types';
import { API_SEARCH } from '~/src/utils/api';
import { Transaction, TransactionHybrid } from '~/src/types/ledger';
import { useSearchParams } from '@remix-run/react';
import { SearchPolicies, SearchTargets } from '~/src/types/search';
import { Cursor } from '~/src/types/generic';
import {
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
} from '~/src/components/Navbar/routes';
import { useNavigate } from 'react-router-dom';
import {
  Amount,
  Date,
  LoadingButton,
  Row,
  SourceDestination,
  Txid,
} from '@numaryhq/storybook';
import { buildQuery } from '~/src/utils/search';
import { ArrowRight } from '@mui/icons-material';
import { useService } from '~/src/hooks/useService';
import { useTranslation } from 'react-i18next';
import Table from '~/src/components/Wrappers/Table';

const normalize = (cursor: Cursor<Transaction>): Cursor<Transaction> =>
  ({
    ...cursor,
    data: flatten(
      get(cursor, 'data', []).map((transaction: Transaction) =>
        get(transaction, 'postings', []).map((posting, index) => ({
          ...posting,
          postingId: index,
          ...omit(transaction, 'postings'),
        }))
      )
    ),
  } as unknown as Cursor<Transaction>);

const TransactionList: FunctionComponent<TransactionListProps> = ({
  account,
  withPagination,
  paginationSize = 15,
  currentLedger,
}) => {
  const [transactions, setTransactions] = useState<Cursor<Transaction>>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = buildQuery(searchParams);
  const { api } = useService();
  const { t } = useTranslation();
  const accountDetailsSearchBody = {
    ...query,
    size: 5,
    policy: SearchPolicies.OR,
    terms: [`destination=${account}`, `source=${account}`],
    target: SearchTargets.TRANSACTION,
  };

  useEffect(() => {
    (async () => {
      const load = await api.postResource<Cursor<Transaction>>(
        API_SEARCH,
        account ? accountDetailsSearchBody : query,
        'cursor'
      );
      if (load) {
        setTransactions(normalize(load));
      }
    })();
  }, [searchParams, account]);

  const handleAction = (transaction: TransactionHybrid) =>
    navigate(getLedgerTransactionDetailsRoute(transaction.txid, currentLedger));

  const handleSourceDestinationAction = (id: string) => {
    navigate(getLedgerAccountDetailsRoute(id, currentLedger));
  };

  const renderRowActions = (transaction: TransactionHybrid) => (
    <LoadingButton
      id={`show-${transaction.txid}`}
      onClick={() => handleAction(transaction)}
      endIcon={<ArrowRight />}
    />
  );

  return (
    <>
      <Table
        withPagination={withPagination}
        paginationSize={paginationSize}
        items={transactions}
        action={true}
        columns={[
          {
            key: 'txid',
            label: t('pages.ledgers.transactions.table.columnLabel.txid'),
          },
          {
            key: 'value',
            label: t('pages.ledgers.transactions.table.columnLabel.value'),
          },
          {
            key: 'source',
            label: t('pages.ledgers.transactions.table.columnLabel.source'),
          },
          {
            key: 'destination',
            label: t(
              'pages.ledgers.transactions.table.columnLabel.destination'
            ),
          },
          {
            key: 'date',
            label: t('pages.ledgers.transactions.table.columnLabel.date'),
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
                  onClick={() =>
                    handleSourceDestinationAction(transaction.source)
                  }
                />,
                <SourceDestination
                  key={transaction.txid}
                  label={transaction.destination}
                  onClick={() =>
                    handleSourceDestinationAction(transaction.destination)
                  }
                />,
                <Date
                  key={transaction.txid}
                  timestamp={transaction.timestamp}
                />,
              ]}
              item={transaction}
              renderActions={() => renderRowActions(transaction)}
            />
          );
        }}
      />
    </>
  );
};

export default TransactionList;
