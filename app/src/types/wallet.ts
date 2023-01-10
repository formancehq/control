import { ObjectOf } from '@numaryhq/storybook';

export type Wallet = {
  id: string;
  metadata: { description: string };
  name: string;
  createdAt: Date;
};

export type WalletBalance = {
  name: string;
};

export type WalletDetailedBalance = WalletBalance & {
  assets: ObjectOf<number>;
};

export type WalletHold = {
  id: string;
  walletID: string;
  metadata: ObjectOf<any>;
  description: string;
  createdAt: Date;
  asset: string;
  destination: {
    balance: string;
    identifier: string;
    type: string;
  };
};
