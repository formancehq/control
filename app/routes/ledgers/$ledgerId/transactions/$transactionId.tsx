import * as React from 'react';

import { Box, Typography } from '@mui/material';
import { MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { omit } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  Amount,
  Date,
  Page,
  Row,
  SectionWrapper,
  SourceDestination,
  Txid,
} from '@numaryhq/storybook';

import PostingsGraph from '~/src/components/Dataviz/PostingsGraph';
import {
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
} from '~/src/components/Navbar/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import Metadata from '~/src/components/Wrappers/Metadata';
import Table from '~/src/components/Wrappers/Table';
import { ObjectOf } from '~/src/types/generic';
import {
  LedgerResources,
  Posting,
  PostingHybrid,
  Transaction,
} from '~/src/types/ledger';
import { API_LEDGER } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

const normalizePostings = (data: Transaction): PostingHybrid[] =>
  data.postings.map(
    (posting: Posting) =>
      ({
        ...omit(data, ['postings']),
        ...posting,
      } as PostingHybrid)
  );

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
  async function handleData() {
    invariant(params.ledgerId, 'Expected params.ledgerId');
    invariant(params.transactionId, 'Expected params.transactionId');

    const transaction = await (
      await createApiClient(request)
    ).getResource<Transaction>(
      `${API_LEDGER}/${params.ledgerId}/${LedgerResources.TRANSACTIONS}/${params.transactionId}`,
      'data'
    );

    if (transaction) {
      return {
        postings: normalizePostings(transaction),
        metadata: transaction.metadata,
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
  const navigate = useNavigate();
  const loaderData = useLoaderData<{
    postings: PostingHybrid[];
    metadata: ObjectOf<any>;
  }>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const transaction = fetcher.data || loaderData;

  const sync = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fetcher.load(getLedgerTransactionDetailsRoute(id!, ledgerId!));
  };

  const handleSourceDestinationAction = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    navigate(getLedgerAccountDetailsRoute(id, ledgerId!));
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
          <Table
            withPagination={false}
            items={transaction.postings}
            columns={[
              {
                key: 'txid',
                label: t('pages.transaction.table.columnLabel.txid'),
              },
              {
                key: 'amount',
                label: t('pages.transaction.table.columnLabel.amount'),
              },
              {
                key: 'source',
                label: t('pages.transaction.table.columnLabel.source'),
              },
              {
                key: 'destination',
                label: t('pages.transaction.table.columnLabel.destination'),
              },
              {
                key: 'date',
                label: t('pages.transaction.table.columnLabel.date'),
              },
            ]}
            renderItem={(posting: PostingHybrid, index) => (
              <Row
                key={index}
                keys={[
                  <Txid id={posting.txid} key={posting.txid} />,
                  <Amount
                    asset={posting.asset}
                    key={posting.txid}
                    amount={posting.amount}
                  />,
                  <SourceDestination
                    key={posting.txid}
                    label={posting.source}
                    color="blue"
                    onClick={() =>
                      handleSourceDestinationAction(posting.source)
                    }
                  />,
                  <SourceDestination
                    key={posting.txid}
                    label={posting.destination}
                    color="blue"
                    onClick={() =>
                      handleSourceDestinationAction(posting.destination)
                    }
                  />,
                  <Date key={posting.txid} timestamp={posting.timestamp} />,
                ]}
                item={posting}
              />
            )}
          />
        </SectionWrapper>
        {/* Graph Section */}
        {transaction.postings.length > 0 && (
          <SectionWrapper title={t('pages.transaction.graph.title')}>
            <PostingsGraph postings={transaction.postings} />
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
