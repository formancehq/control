import type { ReactElement } from 'react';
import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Divider, Typography } from '@mui/material';
import {
  Date,
  DividerWithSpace,
  Page,
  Row,
  Table,
  theme,
} from '@numaryhq/storybook';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ContentCopy from '@mui/icons-material/ContentCopy';
import StopIcon from '@mui/icons-material/Stop';
import { JSONTree } from 'react-json-tree';
import { AdjustmentsItem, PaymentDetail } from '~/src/types/payment';
import { API_PAYMENT, ApiClient } from '~/src/utils/api';
import { copyTokenToClipboard } from '~/src/utils/clipboard';

// this will be deleted when Reconciliation is done
interface Reconciliation {
  transactionValue: string;
  city: string;
  transactionId: string;
  transactionAmount: string;
  date: string;
}

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
    />
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.paymentId, 'Expected params.paymentId');

  const getPayment = await new ApiClient().getResource<PaymentDetail>(
    `${API_PAYMENT}/payments/${params.paymentId}`,
    'data'
  );

  return {
    details: getPayment,
  };
};

const themeRawData = {
  base00: theme.palette.neutral[900],
  base01: theme.palette.neutral[100],
  base02: theme.palette.neutral[100],
  base03: theme.palette.neutral[100],
  base04: theme.palette.neutral[100],
  base05: theme.palette.neutral[100],
  base06: theme.palette.neutral[100],
  base07: theme.palette.neutral[100],
  base08: theme.palette.default.bright,
  base09: theme.palette.neutral[900],
  base0A: theme.palette.yellow.darker,
  base0B: theme.palette.default.normal,
  base0C: theme.palette.default.darker,
  base0D: theme.palette.neutral[0],
  base0E: theme.palette.default.bright,
  base0F: theme.palette.default.bright,
};

const boxWithCopyToClipboard = (title: string, id: string, color: string) => {
  const copyToClipBoard = () => copyTokenToClipboard(id);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px 0 20px',
        width: '45%',
        height: 50,
        backgroundColor: color,
      }}
    >
      <Typography>{title}</Typography>
      <Box
        sx={{
          display: 'flex',
          width: '70%',
          justifyContent: 'space-around',
        }}
      >
        <Typography noWrap>{id}</Typography>
        <ContentCopy color="action" onClick={copyToClipBoard} />
      </Box>
    </Box>
  );
};

const chipsWithColor = (
  label: string,
  backgroundColor: string,
  color?: string
) => <Chip label={label} variant="square" sx={{ backgroundColor, color }} />;

const eventsJournalItem = (eventTitle: string, date: string) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      padding: '10px 0 10px 0',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
      <StopIcon sx={{ color: theme.palette.grey[500] }} />
      {eventTitle}
    </Typography>
    <Typography
      variant="footNote"
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Divider sx={{ width: '200px', marginRight: '20px' }} />
      <Date timestamp={date} format="DD/MM/YYYY" />
    </Typography>
  </Box>
);

const dataItem = (title: string, children: ReactElement) => (
  <Box
    sx={{
      display: 'flex',
      padding: '5px 0 5px 0',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="action">{title}:</Typography>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '300px',
        justifyContent: 'flex-start',
      }}
    >
      <Typography
        variant="footNote"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {children}
      </Typography>
    </Box>
  </Box>
);

const titleHeader = (title: string, date: string) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'baseline',
    }}
  >
    <Typography variant="h1" sx={{ pr: '10px' }}>
      {title}
    </Typography>
    <Typography
      variant="body1"
      sx={{ pr: '5px', color: theme.palette.neutral[600] }}
    >
      Date
    </Typography>
    <Date
      timestamp={date}
      format="DD/MM/YYYY"
      color={theme.palette.neutral[600]}
    />
  </Box>
);

interface PaymentDetailsLoaderWrap {
  details: PaymentDetail;
}

export default function PaymentDetails() {
  const { details } = useLoaderData<PaymentDetailsLoaderWrap>();
  const { t } = useTranslation();

  return (
    <Page
      id="payment"
      title={titleHeader(t('pages.payment.title'), details.createdAt)}
      onClick={() => null}
      actionLabel={t('pages.payment.stripeBtnTitle')}
      actionId="add-lorem"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          backgroundColor: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            paddingBottom: '20px',
          }}
        >
          {boxWithCopyToClipboard(
            t('pages.payment.id'),
            details.id,
            theme.palette.blue.light
          )}
          {boxWithCopyToClipboard(
            t('pages.payment.reference'),
            details.id,
            theme.palette.violet.light
          )}
        </Box>
        <DividerWithSpace />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '45%',
              flexDirection: 'column',
              justifyContent: 'start',
            }}
          >
            {dataItem(
              t('pages.payment.type'),
              chipsWithColor(
                'Pay-in',
                theme.palette.green.light,
                theme.palette.green.darker
              )
            )}
            {dataItem(
              t('pages.payment.processor'),
              <Box sx={{ m: '10px' }}>{details.provider}</Box>
            )}
            {dataItem(
              t('pages.payment.status'),
              chipsWithColor(
                details.status,
                theme.palette.green.light,
                theme.palette.green.darker
              )
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              width: '45%',
              flexDirection: 'column',
            }}
          >
            {dataItem(
              t('pages.payment.netValue'),
              <>{details.initialAmount}</>
            )}
            {dataItem(
              t('pages.payment.initialAmount'),
              <>{details.initialAmount}</>
            )}
          </Box>
        </Box>
        <DividerWithSpace />
        <Typography variant="headline">
          {t('pages.payment.eventJournal.title')}
        </Typography>
        {details.adjustments.map(
          (adjustments: AdjustmentsItem, index: number) => (
            <div key={index}>
              {eventsJournalItem(
                t('pages.payment.eventJournal.statusChange', {
                  value1: details.initialAmount,
                  value2: adjustments.amount,
                }),
                adjustments.date
              )}
              {eventsJournalItem(
                t('pages.payment.eventJournal.netValueChange', {
                  value1: details.status,
                  value2: adjustments.status,
                }),
                adjustments.date
              )}
            </div>
          )
        )}
        <DividerWithSpace />
        <Typography variant="headline" sx={{ pb: '10px' }}>
          {t('pages.payment.reconciliation.title')}
        </Typography>
        <Typography
          variant="footNote"
          sx={{ color: ({ palette }) => palette.grey[600] }}
        >
          {t('pages.payment.reconciliation.subTitle')}
        </Typography>

        <Table
          labels={{
            pagination: {
              showing: 'Showing',
              separator: '/',
              results: 'results',
            },
            noResults: 'No results',
          }}
          id="no-result"
          items={[]}
          columns={[
            { key: 'id', label: 'Uniq Id' },
            { key: 'name', label: 'Lastname' },
            { key: 'status', label: 'Status' },
          ]}
          withPagination={false}
          withHeader={false}
          onNext={() => null}
          onPrevious={() => null}
          renderItem={(reconciliationItem: Reconciliation, index: number) => (
            <Row
              item={reconciliationItem}
              keys={[
                <Typography key={index}>
                  {reconciliationItem.transactionValue}
                </Typography>,
                <Chip
                  key={index}
                  label={reconciliationItem.city}
                  variant="square"
                />,
                <Chip
                  key={index}
                  label={reconciliationItem.transactionId}
                  variant="square"
                />,
                <Typography key={index}>
                  {reconciliationItem.transactionValue}
                </Typography>,
                <Typography key={index} variant="footNote">
                  {reconciliationItem.date}
                </Typography>,
              ]}
            />
          )}
        />

        <DividerWithSpace />

        <Typography variant="headline">
          {t('pages.payment.metadata')}
        </Typography>
        <Table
          labels={{
            pagination: {
              showing: 'Showing',
              separator: '/',
              results: 'results',
            },
            noResults: 'No results',
          }}
          withPagination={false}
          key={details.id}
          onNext={() => null}
          onPrevious={() => null}
          withHeader={false}
          items={[]}
          columns={[
            { key: 'id', label: 'Uniq Id' },
            { key: 'name', label: 'Lastname' },
            { key: 'status', label: 'Status' },
          ]}
          renderItem={(reconciliationItem: Reconciliation, index: number) => (
            <Row
              item={reconciliationItem}
              keys={[
                <Typography key={index}>
                  {reconciliationItem.transactionValue}
                </Typography>,
                <Chip
                  key={index}
                  label={reconciliationItem.city}
                  variant="square"
                />,
                <Chip
                  key={index}
                  label={reconciliationItem.transactionId}
                  variant="square"
                />,
                <Typography key={index}>
                  {reconciliationItem.transactionValue}
                </Typography>,
                <Typography key={index} variant="footNote">
                  {reconciliationItem.date}
                </Typography>,
              ]}
            />
          )}
        />

        <DividerWithSpace />

        <Typography variant="headline">
          {t('pages.payment.rawObject')}
        </Typography>
        <Box
          sx={{
            '& li': {
              fontFamily: ({ typography }) => typography.fontFamily,
              fontSize: ({ typography }) => typography.body1.fontSize,
            },
          }}
        >
          <JSONTree data={details.raw} theme={themeRawData} />
        </Box>
      </Box>
    </Page>
  );
}
