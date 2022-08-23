import { Box, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { Payment, PaymentTypes } from '~/src/types/payment';
import { Amount, Chip, Date, LoadingButton, Row } from '@numaryhq/storybook';
import { useNavigate } from 'react-router-dom';
import { getRoute, PAYMENT_ROUTE } from '~/src/components/Navbar/routes';
import { ArrowRight, NorthEast, SouthEast } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Table from '~/src/components/Wrappers/Table';
import { PaymentListProps } from '~/src/components/Wrappers/Lists/PaymentList/types';
import { get } from 'lodash';
import { providersMap } from '~/src/utils/providersMap';

const PaymentList: FunctionComponent<PaymentListProps> = ({ payments }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderRowActions = (payment: Payment) => (
    <Box component="span" key={payment.id}>
      <LoadingButton
        id={`show-${payment.id}`}
        onClick={() => navigate(getRoute(PAYMENT_ROUTE, payment.id))}
        endIcon={<ArrowRight />}
      />
    </Box>
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
          width: 30,
        },
        { key: 'status', label: t('pages.payments.table.columnLabel.status') },
        {
          key: 'reference',
          label: t('pages.payments.table.columnLabel.reference'),
        },
        { key: 'value', label: t('pages.payments.table.columnLabel.value') },
        { key: 'date', label: t('pages.payments.table.columnLabel.date') },
      ]}
      renderItem={(payment: Payment, index: number) => {
        const logoAttr = get(providersMap, payment.provider.toLowerCase());

        return (
          <Row
            key={index}
            keys={[
              <Chip
                key={index}
                label={payment.type}
                variant="square"
                color={payment.type === PaymentTypes.PAY_OUT ? 'red' : 'green'}
                icon={
                  payment.type === PaymentTypes.PAY_OUT ? (
                    <NorthEast />
                  ) : (
                    <SouthEast />
                  )
                }
              />,
              <Box
                component="span"
                key={index}
                display="flex"
                alignItems="center"
                sx={{
                  '& img': {
                    marginRight: 1,
                    width: logoAttr ? logoAttr.width : 'initial',
                  },
                }}
              >
                {logoAttr && <img src={logoAttr.path} alt={payment.provider} />}
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {payment.provider}
                </Typography>
              </Box>,
              <Chip
                key={index}
                label={payment.status}
                variant="square"
                color={payment.status === 'succeeded' ? 'violet' : undefined}
              />,
              <Typography key={index}>{payment.reference}</Typography>,
              <Amount
                asset={payment.asset}
                key={index}
                amount={payment.initialAmount}
              />,
              <Date key={index} timestamp={payment.date} />,
            ]}
            item={payment}
            renderActions={() => renderRowActions(payment)}
          />
        );
      }}
    />
  );
};

export default PaymentList;
