import React, { FunctionComponent } from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Amount, Chip, Date, LoadingButton, Row } from '@numaryhq/storybook';

import { getRoute, PAYMENT_ROUTE } from '~/src/components/Navbar/routes';
import { PaymentListProps } from '~/src/components/Wrappers/Lists/PaymentList/types';
import PayInChips from '~/src/components/Wrappers/PayInChips';
import PaymentStatusChip from '~/src/components/Wrappers/PaymentStatusChip';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { Payment } from '~/src/types/payment';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

const PaymentList: FunctionComponent<PaymentListProps> = ({
  payments,
  withPagination = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderRowActions = (payment: Payment) => (
    <Box component="span" key={payment.id}>
      <LoadingButton
        id={`show-${payment.id}`}
        onClick={() =>
          navigate(
            `${getRoute(PAYMENT_ROUTE, payment.id)}?provider=${
              payment.provider
            }&reference=${payment.reference}`
          )
        }
        endIcon={<ArrowRight />}
      />
    </Box>
  );

  return (
    <Table
      id="payments-list"
      items={payments}
      withPagination={withPagination}
      action
      columns={[
        {
          key: 'type',
          label: t('pages.payments.table.columnLabel.type'),
          width: 15,
        },
        {
          key: 'provider',
          label: t('pages.payments.table.columnLabel.provider'),
          width: 10,
        },
        {
          key: 'status',
          label: t('pages.payments.table.columnLabel.status'),
          width: 15,
        },
        {
          key: 'scheme',
          label: t('pages.payments.table.columnLabel.scheme'),
          width: 15,
        },
        {
          key: 'reference',
          label: t('pages.payments.table.columnLabel.reference'),
          width: 25,
        },
        {
          key: 'value',
          label: t('pages.payments.table.columnLabel.value'),
          width: 10,
        },
        {
          key: 'createdAt',
          label: t('pages.payments.table.columnLabel.date'),
          sort: true,
          width: 10,
        },
      ]}
      renderItem={(payment: Payment, index: number) => (
        <Row
          key={index}
          keys={[
            <PayInChips key={index} type={payment.type} />,
            <ProviderPicture key={index} provider={payment.provider} />,
            <PaymentStatusChip key={index} status={payment.status} />,
            <Chip
              key={index}
              label={lowerCaseAllWordsExceptFirstLetter(payment.scheme)}
              variant="square"
            />,
            <Typography key={index}>{payment.reference}</Typography>,
            <Amount
              asset={payment.asset}
              key={index}
              amount={payment.initialAmount}
            />,
            <Date key={index} timestamp={payment.createdAt} />,
          ]}
          item={payment}
          renderActions={() => renderRowActions(payment)}
        />
      )}
    />
  );
};

export default PaymentList;
