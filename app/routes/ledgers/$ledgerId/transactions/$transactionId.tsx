import * as React from 'react';
import {
  Amount,
  Date,
  Page,
  SectionWrapper,
  SourceDestination,
  Txid,
} from '@numaryhq/storybook';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { API_LEDGER, ApiClient } from '~/src/utils/api';
import {
  LedgerResources,
  Metadata as MetadataType,
  Posting,
  PostingHybrid,
  Transaction,
} from '~/src/types/ledger';
import { omit } from 'lodash';
import Table from '../../../../src/components/Table';
import Row from '~/src/components/Table/components/Row';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getLedgerAccountDetailsRoute,
  getLedgerTransactionDetailsRoute,
} from '~/src/components/Navbar/routes';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import PostingsGraph from '~/src/components/Dataviz/PostingsGraph';
import { MetaFunction } from '@remix-run/node';
import { getCurrentLedger } from '~/src/utils/localStorage';
import Metadata from '~/src/components/Metadata';
import { prettyJson } from '~/src/components/Metadata/service';

export const normalizePostings = (data: Transaction): PostingHybrid[] =>
  data.postings.map(
    (posting: Posting) =>
      ({
        ...omit(data, ['postings']),
        ...posting,
      } as PostingHybrid)
  );

export const meta: MetaFunction = () => ({
  title: 'Transaction details for a transaction',
  description: 'Display transaction details',
});

export const loader: LoaderFunction = async ({
  params,
}): Promise<{
  postings: PostingHybrid[];
  metadata: MetadataType[];
} | null> => {
  invariant(params.ledgerId, 'Expected params.ledgerId');
  invariant(params.transactionId, 'Expected params.transactionId');

  const transaction = await new ApiClient().getResource<Transaction>(
    `${API_LEDGER}/${params.ledgerId}/${LedgerResources.TRANSACTIONS}/${params.transactionId}`,
    'data'
  );

  if (transaction) {
    return {
      postings: normalizePostings(transaction),
      metadata: [{ value: prettyJson(transaction.metadata as JSON) }],
    };
  }

  return null;
};

export default function Index() {
  const { transactionId: id } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const loaderData = useLoaderData<{
    postings: PostingHybrid[];
    metadata: MetadataType[];
  }>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const transaction = fetcher.data || loaderData;

  const sync = () => {
    fetcher.load(getLedgerTransactionDetailsRoute(id!, getCurrentLedger()!));
  };

  const handleSourceDestinationAction = (id: string) => {
    navigate(getLedgerAccountDetailsRoute(id, getCurrentLedger()!));
  };

  return (
    <Page id="transaction" title={id}>
      <>
        {/* Postings Section */}
        <SectionWrapper
          title={t('pages.ledgers.transactions.details.postings.title')}
        >
          <Table
            withPagination={false}
            key={id}
            items={transaction.postings}
            columns={[
              { key: 'txid' },
              { key: 'amount' },
              { key: 'source' },
              { key: 'destination' },
              { key: 'date' },
            ]}
            resource={'ledgers.transactions.details'}
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
                    onClick={() =>
                      handleSourceDestinationAction(posting.source)
                    }
                  />,
                  <SourceDestination
                    key={posting.txid}
                    label={posting.destination}
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
          <SectionWrapper
            title={t('pages.ledgers.transactions.details.graph.title')}
          >
            <PostingsGraph postings={transaction.postings} />
          </SectionWrapper>
        )}
        {/* Metadata Section */}
        {id && (
          <Metadata
            sync={sync}
            metadata={transaction.metadata as MetadataType[]}
            title={t('pages.ledgers.transactions.details.metadata.title')}
            resource={LedgerResources.TRANSACTIONS}
            id={id}
          />
        )}
      </>
    </Page>
  );
}
