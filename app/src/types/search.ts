export enum SearchTargets {
  ACCOUNT = 'ACCOUNT',
  TRANSACTION = 'TRANSACTION',
  PAYMENT = 'PAYMENT',
  ASSET = 'ASSET',
}

export enum SearchPolicies {
  OR = 'OR',
  AND = 'AND',
}

export type SearchTarget =
  | SearchTargets.TRANSACTION
  | SearchTargets.ACCOUNT
  | SearchTargets.PAYMENT
  | SearchTargets.ASSET;

export type SearchBody = {
  ledgers?: string[];
  size?: string | number;
  terms?: string[];
  cursor?: string;
  target?: SearchTarget;
  policy?: SearchPolicies.OR | SearchPolicies.AND;
};

export type SearchMetas = {
  account: {
    total: number;
  };
  transaction: {
    total: number;
  };
};
