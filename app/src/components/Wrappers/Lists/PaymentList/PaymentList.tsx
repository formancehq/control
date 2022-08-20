import { Chip } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { Payment } from '~/src/types/payment';
import { Amount, Date, LoadingButton, Row } from '@numaryhq/storybook';
import { useNavigate } from 'react-router-dom';
import { getRoute, PAYMENT_ROUTE } from '~/src/components/Navbar/routes';
import { ArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Table from '~/src/components/Wrappers/Table';
import { PaymentListProps } from '~/src/components/Wrappers/Lists/PaymentList/types';

const PaymentList: FunctionComponent<PaymentListProps> = ({ payments }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderRowActions = (payment: Payment) => (
    <LoadingButton
      id={`show-${payment.id}`}
      onClick={() => navigate(getRoute(PAYMENT_ROUTE, payment.id))}
      endIcon={<ArrowRight />}
    />
  );

  return (
    <Table
      id="payments-list"
      items={payments}
      action={true}
      columns={[
        { key: 'type', label: t('pages.payments.table.columnLabel.type') },
        {
          key: 'provider',
          label: t('pages.payments.table.columnLabel.provider'),
        },
        { key: 'status', label: t('pages.payments.table.columnLabel.status') },
        {
          key: 'reference',
          label: t('pages.payments.table.columnLabel.reference'),
        },
        { key: 'value', label: t('pages.payments.table.columnLabel.value') },
        { key: 'date', label: t('pages.payments.table.columnLabel.date') },
      ]}
      renderItem={(payment: Payment, index: number) => (
        <Row
          key={index}
          keys={[
            <Chip key={index} label={payment.type} variant="square" />,
            'provider',
            <Chip key={index} label={payment.status} variant="square" />,
            <Chip key={index} label={payment.reference} variant="square" />,
            <Amount
              asset={payment.asset}
              key={index}
              amount={payment.amount}
            />,
            <Date key={index} timestamp={payment.date} />,
          ]}
          item={payment}
          renderActions={() => renderRowActions(payment)}
        />
      )}
    />
  );
};

export default PaymentList;
