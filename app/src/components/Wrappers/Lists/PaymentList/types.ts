import { Payment } from '~/src/types/payment';

export type PaymentListProps = {
  payments: Payment[];
  withPagination?: boolean;
};
