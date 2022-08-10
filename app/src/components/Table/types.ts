export enum PaginationAction {
  PREVIOUS = 'previous',
  AFTER = 'after',
  INIT = '',
}

export type TableLoad = () => Promise<any>;
export type TableProps = {
  renderItem: (_item: any, key: number, data: any) => void;
  columns: { key: string; width?: number; hidden?: boolean }[];
  load?: TableLoad;
  resource: string;
  id?: string;
  withPagination?: boolean;
  withFilters?: boolean;
  paginationSize?: number;
  items?: any;
  path?: string;
  withHeader?: boolean;
  onInit?: () => void;
};
