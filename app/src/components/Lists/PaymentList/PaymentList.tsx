import { Chip } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { Payment } from '~/src/types/payment';
import { TableConfig } from '~/src/types/generic';
import { Amount, Date, LoadingButton } from '@numaryhq/storybook';
import Row from '~/src/components/Table/components/Row';
import Table from '../../Table';
import { useNavigate } from 'react-router-dom';
import { getRoute, PAYMENT_ROUTE } from '~/src/components/Navbar/routes';
import { ArrowRight } from '@mui/icons-material';

const PaymentList: FunctionComponent<{ payments: [] }> = ({ payments }) => {
  const navigate = useNavigate();

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
      key="pages.payments.tab"
      items={payments}
      columns={[
        { key: 'type' },
        { key: 'provider' },
        { key: 'status' },
        { key: 'reference' },
        { key: 'value' },
        { key: 'date' },
        { key: TableConfig.ACTIONS },
      ]}
      resource="payments"
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
