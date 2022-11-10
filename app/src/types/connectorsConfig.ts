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

export type Connectors = {
  provider: string;
  disabled: boolean;
};
