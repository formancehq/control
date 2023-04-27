import * as React from 'react';
import { ReactElement } from 'react';

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
import { PaymentSchemeChip } from '~/src/components/Wrappers/PaymentSchemeChip/PaymentSchemeChip';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  paymentColorMap,
  paymentIconMap,
  paymentTypeColorMap,
  paymentTypeIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import Table from '~/src/components/Wrappers/Table';
import { FEATURES } from '~/src/contexts/service';
import { useFeatureFlag } from '~/src/hooks/useFeatureFlag';
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
  useFeatureFlag(FEATURES.PAYMENTS);

  const renderTableItem = (
    key: string,
    index: number,
    children: ReactElement
  ) => (
    <Box component="span" key={index}>
      <Typography
        color="textSecondary"
        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
      >
        {t(`pages.payments.table.columnLabel.${key}`)}
      </Typography>
      {children}
    </Box>
  );

  return (
    <Page id="payment">
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
          <StatusChip
            status={payment.status}
            iconMap={paymentIconMap}
            colorMap={paymentColorMap}
          />
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
        {/* Details */}
        <Box>
          <Table
            id="details"
            withPagination={false}
            withHeader={false}
            key={`${payment.id}.details`}
            items={[payment]}
            columns={[]}
            renderItem={(payment: Payment, index: number) => (
              <Row
                item={payment}
                key={index}
                keys={[
                  renderTableItem(
                    'direction',
                    index,
                    <StatusChip
                      key={index}
                      status={payment.type}
                      iconMap={paymentTypeIconMap}
                      colorMap={paymentTypeColorMap}
                    />
                  ),
                  renderTableItem(
                    'scheme',
                    index,
                    <PaymentSchemeChip key={index} scheme={payment.scheme} />
                  ),
                  renderTableItem(
                    'netAmount',
                    index,
                    <Amount
                      key={index}
                      amount={payment.initialAmount}
                      asset={payment.asset}
                    />
                  ),
                  renderTableItem(
                    'initialAmount',
                    index,
                    <Amount
                      key={index}
                      amount={payment.initialAmount}
                      asset={payment.asset}
                    />
                  ),
                ]}
              />
            )}
          />
        </Box>
        {/* Journal */}
        <SectionWrapper title={t('pages.payment.eventJournal.title')}>
          <>
            <Box
              sx={{
                borderRadius: '6px',
                border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
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
                      <Typography>
                        {t('pages.payment.eventJournal.timelineCreated')}
                      </Typography>
                      <Typography color="textSecondary">{`${payment.createdAt}`}</Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Box>
          </>
        </SectionWrapper>
        {/* Reconciliation */}
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
              <Row keys={['key', 'value']} item={item} key={item.key} />
            )}
          />
        </SectionWrapper>
      </>
    </Page>
  );
}
