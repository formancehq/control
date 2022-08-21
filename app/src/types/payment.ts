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
  type: string;
  status: string;
  initialAmount: number;
  asset: string;
  date: Date;
  raw: ObjectOf<any>;
};
