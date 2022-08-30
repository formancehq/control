import { ObjectOf } from './generic';

export enum PaymentTypes {
  PAY_IN = 'pay-in',
  PAY_OUT = 'payout',
  OTHER = 'other',
}

export enum PaymentStatuses {
  REFUNDED = 'refunded',
  AUTHORIZED = 'authorized',
  COMPLETED = 'completed',
}

export type PaymentType =
  | PaymentTypes.PAY_IN
  | PaymentTypes.PAY_OUT
  | PaymentTypes.OTHER;

export type Payment = {
  id: string;
  provider: string;
  reference: string;
  scheme: string;
  type: PaymentTypes;
  status: string;
  initialAmount: number;
  asset: string;
  createdAt: Date;
  raw: ObjectOf<any>;
};

export type PaymentDetail = {
  id: string;
  provider: string;
  createdAt: string;
  reference: string;
  scheme: string;
  type: PaymentType;
  status: string;
  initialAmount: number;
  asset: string;
  raw: ObjectOf<any>;
  adjustments: Array<AdjustmentsItem>;
};

export interface AdjustmentsItem {
  status: string;
  amount: number;
  date: string;
  absolute: boolean;
  raw: ObjectOf<any>;
}
