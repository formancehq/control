export type ObjectOf<T> = {
  [name: string]: T;
};

export enum TableConfig {
  ACTIONS = 'actions',
}

export type Cursor<T> = {
  data: Array<T>;
  hasMore: boolean;
  pageSize: number;
  total: { value: number; relation: string };
  previous: string;
  next: string;
};

export enum Errors {
  NOT_FOUND = 'resourceNotFound',
  MS_DOWN = 'microServiceDown',
}
