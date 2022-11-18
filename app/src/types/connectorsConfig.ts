import { ObjectOf } from './generic';

export type InputType = {
  datatype: string;
  required?: boolean;
};

export type ConnectorConfigFormProps = {
  stripe: Record<string, InputType>;
  modulr: Record<string, InputType>;
  dummypay: Record<string, InputType>;
  wise: Record<string, InputType>;
};

export type ConnectorFormValues = {
  stripe: ObjectOf<string>;
  modulr: ObjectOf<string>;
  dummypay: ObjectOf<string>;
  wise: ObjectOf<string>;
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
