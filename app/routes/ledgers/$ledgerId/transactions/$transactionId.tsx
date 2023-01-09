import * as React from 'react';

import { Box, Typography } from '@mui/material';
import { MetaFunction, Session } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { get, omit } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { Page, SectionWrapper, Txid } from '@numaryhq/storybook';

import PostingsGraph from '~/src/components/Dataviz/PostingsGraph';
import { getLedgerTransactionDetailsRoute } from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import PaymentList from '~/src/components/Wrappers/Lists/PaymentList';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList/TransactionList';
import Metadata from '~/src/components/Wrappers/Metadata';
import { Cursor, ObjectOf } from '~/src/types/generic';
import {
  LedgerResources,
  Posting,
  PostingHybrid,
  Transaction,
} from '~/src/types/ledger';
import { PaymentDetail } from '~/src/types/payment';
import { RECO_METADATA_PATH_KEY } from '~/src/types/reco';
import { API_LEDGER, API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import { buildCursor } from '~/src/utils/format';

const normalizePostings = (
  data: Transaction,
  ledger: string
): Cursor<Transaction> => {
  const items = data.postings.map(
    (posting: Posting) =>
      ({
        ...omit(data, ['postings']),
        ...posting,
        txid: data.txid,
        ledger, // TODO temporary. Use backend when ready
      } as unknown as Transaction)
  );

  return buildCursor(items);
};

export const meta: MetaFunction = () => ({
  title: 'Transaction',
  description: 'Show a transaction',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="transaction"
      title="pages.transaction.title"
      error={error}
      showAction={false}
    />
  );
}

export const loader: LoaderFunction = async ({ params, request }) => {
  async function handleData(session: Session) {
    invariant(params.ledgerId, 'Expected params.ledgerId');
    invariant(params.transactionId, 'Expected params.transactionId');

    const api = await createApiClient(session);
    const transaction = await api.getResource<Transaction>(
      `${API_LEDGER}/${params.ledgerId}/${LedgerResources.TRANSACTIONS}/${params.transactionId}`,
      'data'
    );

    if (transaction) {
      const paymentId = get(transaction.metadata, RECO_METADATA_PATH_KEY);
      let payment = undefined;

      if (paymentId) {
        payment = await api.getResource<PaymentDetail>(
          `${API_PAYMENT}/payments/${paymentId}`,
          'data'
        );
      }

      return {
        postings: normalizePostings(transaction, params.ledgerId),
        metadata: transaction.metadata,
        payment,
      };
    }

    return null;
  }

  return handleResponse(await withSession(request, handleData));
};

export default function Index() {
  const { transactionId: id, ledgerId } = useParams<{
    transactionId: string;
    ledgerId: string;
  }>();
  const loaderData = useLoaderData<{
    postings: PostingHybrid[];
    payment: PaymentDetail | undefined;
    metadata: ObjectOf<any>;
  }>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const transaction = fetcher.data || loaderData;

  const sync = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fetcher.load(getLedgerTransactionDetailsRoute(id!, ledgerId!));
  };

  return (
    <Page
      id="transaction"
      title={
        <Box component="span" display="flex" alignItems="baseline">
          <Typography variant="h1">{t('pages.transaction.title')}</Typography>
          <Box
            sx={{ '& .MuiTypography-money': { fontSize: 24 } }}
            mt="4px"
            ml={1}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <Txid id={parseInt(id!)} />
          </Box>
        </Box>
      }
    >
      <>
        {/* Postings Section */}
        <SectionWrapper title={t('pages.transaction.postings.title')}>
          <TransactionList
            transactions={transaction.postings}
            withPagination={false}
          />
        </SectionWrapper>
        {/* Graph Section */}
        {transaction.postings.data.length > 0 && (
          <SectionWrapper title={t('pages.transaction.graph.title')}>
            <PostingsGraph transactions={transaction.postings.data} />
          </SectionWrapper>
        )}
        {/* Reco Section */}
        {transaction.payment && (
          <SectionWrapper title={t('pages.transaction.reco.title')}>
            <PaymentList
              payments={[transaction.payment]}
              withPagination={false}
            />
          </SectionWrapper>
        )}
        {/* Metadata Section */}
        {id && (
          <Metadata
            sync={sync}
            metadata={transaction.metadata}
            title={t('pages.transaction.metadata.title')}
            resource={LedgerResources.TRANSACTIONS}
            id={id}
          />
        )}
      </>
    </Page>
  );
}
