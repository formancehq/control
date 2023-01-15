import { ObjectOf } from './generic';

export enum PaymentTypes {
  PAY_IN = 'PAY-IN',
  PAY_OUT = 'PAYOUT',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}

export type PaymentType =
  | PaymentTypes.PAY_IN
  | PaymentTypes.PAY_OUT
  | PaymentTypes.OTHER;

export enum PaymentStatuses {
  SUCCEEDED = 'SUCCEEDED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  OTHER = 'OTHER',
}

export type Payment = {
  id: string;
  provider: string;
  reference: string;
  scheme: string;
  type: PaymentTypes;
  status: PaymentStatuses;
  initialAmount: number;
  asset: string;
  createdAt: Date;
  raw: ObjectOf<any>;
};

export type Account = {
  id: string;
  type: string;
  provider: string;
  reference: string;
  createdAt: Date;
};

export enum TaskStatuses {
  STOPPED = 'STOPPED',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  FAILED = 'FAILED',
}

export type PaymentDetail = Payment & {
  adjustments: Array<AdjustmentsItem>;
};

export interface AdjustmentsItem {
  status: PaymentStatuses;
  amount: number;
  date: string;
  absolute: boolean;
  raw: ObjectOf<any>;
}
