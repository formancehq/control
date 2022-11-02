export type InputType = {
  datatype: string;
  required?: boolean;
};

type StripeConfig = {
  apiKey: InputType;
  pollingPeriod: InputType;
  pageSize: InputType;
};

type ModulrConfig = {
  apiKey: InputType;
  apiSecret: InputType;
  endpoint: InputType;
};

type DummyPayConfig = {
  directory: InputType;
  fileGenerationPeriod: InputType;
  filePollingPeriod: InputType;
};

type WiseConfig = {
  apiKey: InputType;
};

export type ConnectorConfigFormProps = {
  stripe: StripeConfig;
  modulr: ModulrConfig;
  dummypay: DummyPayConfig;
  wise: WiseConfig;
};
