export enum Kinds {
  LEDGER_ACCOUNT = 'ledger_account_statement',
  CUSTOMIZED = 'customized',
}

export type Kind = Kinds.LEDGER_ACCOUNT | Kinds.CUSTOMIZED;

export enum Extensions {
  PDF = 'pdf',
  XLS = 'xls',
  CSV = 'csv',
}

export type Extension = Extensions.PDF | Extensions.XLS | Extensions.CSV;

export enum Statuses {
  SUCCEEDED = 'succeeded',
  PENDING = 'pending',
  ERROR = 'error',
}

export type Status = Statuses.SUCCEEDED | Statuses.PENDING | Statuses.ERROR;

export type GenerateReport = {
  kind: Kind;
  extension: Extension;
  startDate: Date;
  endDate: Date;
  resourceId: string;
};

type Resource = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  idOrganization: string;
};
export type Report = {
  ledger: string;
  name: string;
  status: Status;
  extension: Extension;
  bucketKey: string;
} & Resource;

export type ReportResource = ReportResources.HEADERS | ReportResources.REPORTS;

export enum ReportSubResources {
  ORGANIZATIONS = 'organizations',
}

export enum ReportResources {
  HEADERS = 'headers',
  REPORTS = 'reports',
}

export type Header = {
  leftBlock?: string;
  rightBlock?: string;
  logoUrl?: string;
  name: string;
} & Resource;
