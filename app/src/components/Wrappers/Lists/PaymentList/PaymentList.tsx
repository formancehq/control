import React, { FunctionComponent } from "react";

import { ArrowRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Amount, Chip, Date, LoadingButton, Row } from "@numaryhq/storybook";

import { getRoute, PAYMENT_ROUTE } from "~/src/components/Navbar/routes";
import { PaymentListProps } from "~/src/components/Wrappers/Lists/PaymentList/types";
import PayInChips from "~/src/components/Wrappers/PayInChips";
import ProviderPicture from "~/src/components/Wrappers/ProviderPicture";
import Table from "~/src/components/Wrappers/Table";
import { Payment } from "~/src/types/payment";

const PaymentList: FunctionComponent<PaymentListProps> = ({ payments }) => {
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
      action={true}
      columns={[
        { key: "type", label: t("pages.payments.table.columnLabel.type") },
        {
          key: "provider",
          label: t("pages.payments.table.columnLabel.provider"),
          width: 30,
        },
        { key: "status", label: t("pages.payments.table.columnLabel.status") },
        {
          key: "reference",
          label: t("pages.payments.table.columnLabel.reference"),
        },
        { key: "value", label: t("pages.payments.table.columnLabel.value") },
        { key: "date", label: t("pages.payments.table.columnLabel.date") },
      ]}
      renderItem={(payment: Payment, index: number) => (
        <Row
          key={index}
          keys={[
            <PayInChips key={index} type={payment.type} />,
            <ProviderPicture key={index} provider={payment.provider} />,
            <Chip
              key={index}
              label={payment.status}
              variant="square"
              color={payment.status === "succeeded" ? "violet" : undefined}
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
