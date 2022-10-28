type inputType = {
  datatype: string;
  required?: boolean;
};

type StripeConfig = {
  apiKey: inputType;
  pollingPeriod: inputType;
  pageSize: inputType;
};

type ModulrConfig = {
  apiKey: inputType;
  apiSecret: inputType;
  endpoint: inputType;
};

type DummyPayConfig = {
  directory: inputType;
  fileGenerationPeriod: inputType;
  filePollingPeriod: inputType;
};

type WiseConfig = {
  apiKey: inputType;
};

export type ConnectorConfigFormProps = {
  stripe: StripeConfig;
  modulr: ModulrConfig;
  dummypay: DummyPayConfig;
  wise: WiseConfig;
};
