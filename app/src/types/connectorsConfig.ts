import { ObjectOf } from './generic';

export type InputType = {
  dataType: string;
  required?: boolean;
};

export type ConnectorConfigFormProps = {
  [name: string]: Record<string, InputType>;
};

export type ConnectorFormValues = {
  [name: string]: ObjectOf<string>;
};

export type Connector = {
  provider: string;
  disabled: boolean;
};

export type ConnectorTask = {
  provider: string;
  descriptor: { main: boolean };
  createdAt: Date;
  status: 'active' | 'error';
  error: string;
  state?: string;
  id: string;
};

export enum TaskStatuses {
  STOPPED = 'STOPPED',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  FAILED = 'FAILED',
}
export enum ConnectorStatuses {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
