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
import { API_SEARCH, ApiClient } from '~/src/utils/api';
import {
  LedgerResources,
  Posting,
  PostingHybrid,
  Transaction,
} from '~/src/types/ledger';
import { Metadata as MetadataType } from '../../../../src/types/ledger';
import { SearchTargets } from '~/src/types/search';
import { head, omit } from 'lodash';
import Table from '../../../../src/components/Table';
import Row from '~/src/components/Table/components/Row';
import { useNavigate, useParams } from 'react-router-dom';
import { getLedgerAccountDetailsRoute } from '~/src/components/Navbar/routes';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import PostingsGraph from '~/src/components/Dataviz/PostingsGraph';
import { MetaFunction } from 'remix';
import { getCurrentLedger } from '~/src/utils/localStorage';
import Metadata from '~/src/components/Metadata';

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
}): Promise<
  | {
      postings: PostingHybrid[];
      metadata: MetadataType;
    }
  | undefined
> => {
  invariant(params.ledgerId, 'Expected params.ledgerId');
  invariant(params.transactionId, 'Expected params.transactionId');

  const transaction = head(
    await new ApiClient().postResource<Transaction[]>(
      API_SEARCH,
      {
        target: SearchTargets.TRANSACTION,
        terms: [`txid=${params.transactionId}`],
      },
      'cursor.data'
    )
  );
  if (transaction) {
    return {
      postings: normalizePostings(transaction),
      metadata: transaction.metadata,
    };
  }
};

export default function Index() {
  const { transactionId: id } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { postings, metadata } = useLoaderData<{
    postings: PostingHybrid[];
    metadata: MetadataType;
  }>();
  const { t } = useTranslation();

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
            items={postings}
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
        {postings.length > 0 && (
          <SectionWrapper
            title={t('pages.ledgers.transactions.details.graph.title')}
          >
            <PostingsGraph postings={postings} />
          </SectionWrapper>
        )}
        {/* Metadata Section */}
        <Metadata
          metadata={metadata}
          title={t('pages.ledgers.transactions.details.metadata.title')}
          resource={LedgerResources.TRANSACTIONS}
          id="transaction"
        />
      </>
    </Page>
  );
}
