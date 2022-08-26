import type { ReactElement } from 'react';
import * as React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Grid, Tooltip, Typography } from '@mui/material';
import {
  Date,
  DividerWithSpace,
  JsonViewer,
  Page,
  Row,
  Chip,
  theme,
  SectionWrapper,
} from '@numaryhq/storybook';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import ContentCopy from '@mui/icons-material/ContentCopy';
import StopIcon from '@mui/icons-material/Stop';
import { AdjustmentsItem, PaymentDetail } from '~/src/types/payment';
import { API_PAYMENT, ApiClient } from '~/src/utils/api';
import { copyTokenToClipboard } from '~/src/utils/clipboard';
import Table from '~/src/components/Wrappers/Table';
import { LoadingButton } from '@mui/lab';
import { PayInChips } from '~/src/components/PayInChips';
import { ProviderPicture } from '~/src/components/ProviderPicture';

// TODO remove this when Reconciliation is done
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

const boxWithCopyToClipboard = (
  title: string,
  id: string,
  color: string,
  tooltipTitle: string
) => {
  const [open, setOpen] = React.useState(false);
  const copyToClipBoard = () => {
    handleOpen();
    copyTokenToClipboard(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: '10px 10px 10px 26px',
        justifyContent: 'space-between',
        backgroundColor: color,
      }}
    >
      <Typography variant="bold">{title}</Typography>
      <Box
        sx={{
          display: 'flex',
          width: '70%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography noWrap>{id}</Typography>
        <Tooltip
          open={open}
          onClose={handleClose}
          // onOpen={handleOpen}
          title={tooltipTitle}
        >
          <LoadingButton id="copyToCliboardWrapper">
            <ContentCopy color="action" onClick={copyToClipBoard} />
          </LoadingButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const eventsJournalItem = (eventTitle: string, date: string) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      padding: '5px 0 5px 0',
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
      <Date timestamp={date} format="MM/DD/YYYY" />
    </Typography>
  </Box>
);

const dataItem = (title: string, children: ReactElement) => (
  <Box
    sx={{
      display: 'flex',
      padding: '5px 0 5px 0',
      minHeight: '30px',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Typography variant="bold">{title}:</Typography>
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
      format="MM/DD/YYYY"
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
          padding: '20px 20px 4px 20px',
          backgroundColor: 'white',
        }}
      >
        <Grid container spacing={1}>
          <Grid item md={6}>
            {boxWithCopyToClipboard(
              t('pages.payment.id'),
              details.id,
              theme.palette.blue.light,
              t('pages.payment.copyToClipboardTooltip', {
                value: 'id',
              })
            )}
          </Grid>
          <Grid item md={6}>
            {boxWithCopyToClipboard(
              t('pages.payment.reference'),
              details.id,
              theme.palette.violet.light,
              t('pages.payment.copyToClipboardTooltip', {
                value: 'reference',
              })
            )}
          </Grid>
        </Grid>

        <DividerWithSpace pt="32px" mb="32px" />

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
              <PayInChips type={details.type} />
            )}
            {dataItem(
              t('pages.payment.processor'),
              <ProviderPicture provider={details.provider} />
            )}

            {dataItem(
              t('pages.payment.status'),
              <Chip color="green" label={details.status} variant="square" />
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
              <>{`${details.asset} ${details.initialAmount}`}</>
            )}
            {dataItem(
              t('pages.payment.initialAmount'),
              <>{`${details.asset} ${details.initialAmount}`}</>
            )}
          </Box>
        </Box>

        <DividerWithSpace pt="32px" mb="0px" />

        <SectionWrapper title={t('pages.payment.eventJournal.title')}>
          <>
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
          </>
        </SectionWrapper>

        <DividerWithSpace pt="16px" mb="0px" />

        <SectionWrapper title={t('pages.payment.reconciliation.title')}>
          <>
            <Typography
              variant="footNote"
              sx={{ color: ({ palette }) => palette.grey[600] }}
            >
              {t('pages.payment.reconciliation.subTitle')}
            </Typography>
            <Table
              id="no-result"
              items={[]}
              columns={[
                { key: 'id', label: 'Uniq Id' },
                { key: 'name', label: 'Lastname' },
                { key: 'status', label: 'Status' },
              ]}
              withPagination={false}
              withHeader={false}
              renderItem={(
                reconciliationItem: Reconciliation,
                index: number
              ) => (
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
          </>
        </SectionWrapper>

        {/* TODO replace this when Reconciliation is done */}

        <DividerWithSpace pt="16px" mb="0px" />

        {/* TODO replace this when Metadata is done */}
        <SectionWrapper title={t('pages.payment.metadata')}>
          <Table
            withPagination={false}
            key={details.id}
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
        </SectionWrapper>

        <DividerWithSpace pt="16px" mb="0px" />

        <SectionWrapper
          title={t('pages.payment.rawObject')}
          sx={{ mb: '0px !important' }}
        >
          <Box
            sx={{
              p: '5px 10px 10px 10px',
              background: ({ palette }) => palette.neutral[900],
              '& li': {
                fontFamily: ({ typography }) => typography.fontFamily,
                fontSize: ({ typography }) => typography.body1.fontSize,
              },
            }}
          >
            <JsonViewer jsonData={details.raw} />
          </Box>
        </SectionWrapper>
      </Box>
    </Page>
  );
}
