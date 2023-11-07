import { ObjectOf } from '@numaryhq/storybook';

export type CreditWalletProps = {
  metadata: ObjectOf<any>;
  amount: {
    amount: number;
    asset: string;
  };
  balance: string;
  sources: {
    identifier: string;
    type: string;
  }[];
};
