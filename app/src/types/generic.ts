import { PaginationAction } from '~/src/components/Table/types';

export type ObjectOf<T> = {
  [name: string]: T;
};

export type Translator = (_key: string) => string;

export type Paginated = {
  limit: number;
  previous: string;
  after: string;
  action:
    | PaginationAction.AFTER
    | PaginationAction.PREVIOUS
    | PaginationAction.INIT;
  currentPage: number;
  stack: any;
  token: string;
};

export enum TableConfig {
  ACTIONS = 'actions',
}

export type ResourceParams = {
  key: string;
  value: string | number;
  separator?: '/' | '?';
};

export type Cursor<T> = {
  data: Array<T>;
  hasMore: boolean;
  pageSize: number;
  total: { value: number; relation: string };
  previous: string;
  next: string;
};

export enum FeedbackSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

export type Feedback = {
  active: boolean;
  message: string | undefined;
  severity:
    | FeedbackSeverity.INFO
    | FeedbackSeverity.SUCCESS
    | FeedbackSeverity.WARNING
    | FeedbackSeverity.ERROR
    | undefined;
};

export type SetFeedback = (feedback: Feedback) => void;

export type FormValidation = Promise<ObjectOf<string> | undefined>;

export interface FormHandlerInterface<T, K> {
  client: K;
  validate: (values: T) => FormValidation;
}

export enum EventKind {
  SUBMIT = 'submit',
  CTA = 'cta',
}

export enum EventAction {
  GENERATE = 'generate',
  DOWNLOAD = 'download',
  DELETE = 'delete',
  UPDATE = 'update',
  SHOW = 'show',
  CREATE = 'create',
  INVITE = 'invite',
  SIGNUP = 'signup',
  CHANGE = 'change',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export enum FormMode {
  UPDATE = 'update',
  CREATE = 'create',
  READ = 'read',
}

export type FormModeType = FormMode.UPDATE | FormMode.CREATE | FormMode.READ;

export enum RowActionType {
  MODAL = 'modal',
  PAGE = 'page',
  DOWNLOAD = 'download',
}

export type ButtonVariants = 'light' | 'stroke' | 'primary';

export enum Errors {
  NOT_FOUND = 'resourceNotFound',
  MS_DOWN = 'microServiceDown',
}
