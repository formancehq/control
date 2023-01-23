import * as React from 'react';

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from '@mui/lab';
import { Box, Typography } from '@mui/material';
import type { MetaFunction, Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import {
  Amount,
  JsonViewer,
  Page,
  Row,
  SectionWrapper,
} from '@numaryhq/storybook';

import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import TransactionList from '~/src/components/Wrappers/Lists/TransactionList';
import PayInChips from '~/src/components/Wrappers/PayInChips';
import { PaymentSchemeChip } from '~/src/components/Wrappers/PaymentSchemeChip/PaymentSchemeChip';
import PaymentStatusChip from '~/src/components/Wrappers/PaymentStatusChip';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { Cursor } from '~/src/types/generic';
import { Transaction } from '~/src/types/ledger';
import { Payment, PaymentDetail } from '~/src/types/payment';
import { RECO_DEFAULT_LEDGER, RECO_METADATA_PATH_KEY } from '~/src/types/reco';
import { API_LEDGER, API_PAYMENT } from '~/src/utils/api';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';

export const meta: MetaFunction = () => ({
  title: 'Payment',
  description: 'Show a payment',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id="payment"
      title="pages.payment.title"
      error={error}
      showAction={false}
    />
  );
}

export const loader: LoaderFunction = async ({ params, request }) => {
  async function handleData(session: Session) {
    invariant(params.paymentId, 'Expected params.paymentId');
    const api = await createApiClient(session);
    const payment = await api.getResource<PaymentDetail>(
      `${API_PAYMENT}/payments/${params.paymentId}`,
      'data'
    );
    const transactions = await api.getResource<PaymentDetail>(
      `${API_LEDGER}/${RECO_DEFAULT_LEDGER}/transactions?metadata[${RECO_METADATA_PATH_KEY}]=${params.paymentId}`,
      'cursor'
    );

    return {
      payment,
      transactions,
    };
  }

  return handleResponse(await withSession(request, handleData));
};

interface PaymentDetailData {
  payment: PaymentDetail;
  transactions: Cursor<Transaction>;
}

export default function PaymentDetails() {
  const { payment, transactions } =
    useLoaderData<PaymentDetailData>() as unknown as PaymentDetailData;
  const { t } = useTranslation();

  return (
    <Page id="payment" title="">
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            width: '100%',
          }}
        >
          <ProviderPicture provider={payment.provider} text={false} />
          <Typography variant="h1" pr={1}>
            {t('pages.payment.title')}
          </Typography>
          <PaymentStatusChip status={payment.status} />
          <Box
            sx={{
              ml: 'auto',
            }}
          >
            <Typography
              color="textSecondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {payment.id}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Table
            id="details"
            withPagination={false}
            withHeader={false}
            key={`${payment.id}.details`}
            items={[payment]}
            columns={[
              {
                key: 'type',
                label: 'Type',
              },
              {
                key: 'scheme',
                label: 'Scheme',
              },
              // {
              //   key: 'provider',
              //   label: '',
              // },
              // {
              //   key: 'reference',
              //   label: '',
              // },
              {
                key: 'net',
                label: 'Net Amount',
              },
              {
                key: 'initial',
                label: 'Initial Amount',
              },
            ]}
            renderItem={(payment: Payment, index: number) => (
              <Row
                item={payment}
                keys={[
                  // 'provider',
                  <Box component="span" key={index}>
                    <Typography
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      Direction
                    </Typography>
                    <PayInChips type={payment.type} />
                  </Box>,
                  <Box component="span" key={index}>
                    <Typography
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      Scheme
                    </Typography>
                    <PaymentSchemeChip scheme={payment.scheme} />
                  </Box>,
                  // 'reference',
                  <Box component="span" key={index}>
                    <Typography
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      Net Amount
                    </Typography>
                    <Amount
                      amount={payment.initialAmount}
                      asset={payment.asset}
                    />
                  </Box>,
                  <Box component="span" key={index}>
                    <Typography
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      Initial Amount
                    </Typography>
                    <Amount
                      amount={payment.initialAmount}
                      asset={payment.asset}
                    />
                  </Box>,
                ]}
              />
            )}
          />
        </Box>
        {/* Description2 */}
        {/* <Grid container spacing="26px">
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                p: '15px',
              }}
            >
              {dataItem(
                t('pages.payment.type'),
                <PayInChips type={payment.type} />
              )}
              {dataItem(
                t('pages.payment.processor'),
                <ProviderPicture provider={payment.provider} />
              )}
              {dataItem(
                t('pages.payment.status'),
                <PaymentStatusChip status={payment.status} />
              )}
              {dataItem(
                t('pages.payment.scheme'),
                <PaymentSchemeChip scheme={payment.scheme} />
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: '15px',
              }}
            >
              {dataItem(
                t('pages.payment.netValue'),
                <Amount amount={payment.initialAmount} asset={payment.asset} />
              )}
              {dataItem(
                t('pages.payment.initialAmount'),
                <Amount amount={payment.initialAmount} asset={payment.asset} />
              )}
            </Box>
          </Grid>
        </Grid> */}

        <SectionWrapper title={t('pages.payment.eventJournal.title')}>
          <>
            <Box
              sx={{
                borderRadius: '6px',
                border: '1px solid rgb(239, 241, 246)',
              }}
            >
              <Timeline
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineConnector
                      sx={{
                        opacity: 0.2,
                      }}
                    />
                    <TimelineDot
                      sx={{
                        boxShadow: 'none',
                      }}
                    />
                    <TimelineConnector
                      sx={{
                        opacity: 0.2,
                      }}
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box>
                      <Typography>Payment created</Typography>
                      <Typography color="textSecondary">{`${payment.createdAt}`}</Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Box>
          </>
        </SectionWrapper>

        <SectionWrapper title={t('pages.payment.reconciliation.title')}>
          <TransactionList transactions={transactions} withPagination={false} />
        </SectionWrapper>

        {/* Metadata */}
        {/* TODO replace this when Metadata is done */}
        <SectionWrapper title={t('pages.payment.metadata')}>
          <Table
            id="metadata"
            withPagination={false}
            key={payment.id}
            withHeader={false}
            items={[]}
            columns={[]}
            renderItem={(item: any) => <Row item={item} keys={[]} />}
          />
        </SectionWrapper>
        {/* Raw object */}
        <SectionWrapper title={t('pages.payment.rawObject')}>
          <JsonViewer jsonData={payment.raw} />
        </SectionWrapper>
        <SectionWrapper title={t('pages.payment.details.title')}>
          <Table
            withHeader={false}
            withPagination={false}
            items={[
              {
                key: t('pages.payment.details.id'),
                value: payment.id,
              },
              {
                key: t('pages.payment.details.reference'),
                value: payment.reference,
              },
            ]}
            columns={[
              {
                key: 'key',
                label: '',
                width: 30,
              },
              {
                key: 'value',
                label: '',
                width: 30,
              },
            ]}
            renderItem={(item: { key: string; value: any }) => (
              <Row keys={['key', 'value']} item={item} />
            )}
          />
        </SectionWrapper>
      </>
    </Page>
  );
}
