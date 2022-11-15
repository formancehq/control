import React from 'react';

import { capitalize, lowerCase } from 'lodash';
import { Controller } from 'react-hook-form';

import { TextField } from '@numaryhq/storybook';

import i18n from '~/src/translations';
import {
  ConnectorConfigFormProps,
  InputType,
} from '~/src/types/connectorsConfig';
import { ObjectOf } from '~/src/types/generic';

// TODO this config is hardcoded for now but the idea is to fetch it from the API
// so the backend can change the config without having to update the frontend

export enum FormTypes {
  STRING = 'string',
  DURATION = 'duration ns',
  INTEGER = 'integer',
}
export const connectorsConfig = {
  dummypay: {
    directory: {
      datatype: FormTypes.STRING,
      required: true,
    },
    fileGenerationPeriod: {
      datatype: FormTypes.DURATION,
    },
    filePollingPeriod: {
      datatype: FormTypes.DURATION,
    },
  },
  modulr: {
    apiKey: {
      datatype: FormTypes.STRING,
      required: true,
    },
    apiSecret: {
      datatype: FormTypes.STRING,
      required: true,
    },
    endpoint: {
      datatype: FormTypes.STRING,
    },
  },
  stripe: {
    apiKey: {
      datatype: FormTypes.STRING,
      required: true,
    },
    pollingPeriod: {
      datatype: FormTypes.DURATION,
    },
    pageSize: {
      datatype: 'integer',
    },
  },
  wise: {
    apiKey: {
      datatype: FormTypes.STRING,
      required: true,
    },
  },
};

const inputsFactory = ({
  inputConfig,
  name,
  control,
  errors,
  label,
  parentName,
}: {
  inputConfig: InputType;
  name: string;
  control: any;
  errors: ObjectOf<any>;
  label: string;
  parentName: string;
}) => {
  const textFieldSharedConfig = {
    label: capitalize(lowerCase(label)),
    fullWidth: true,
    required: inputConfig.required,
    error: !!errors?.[parentName]?.[name],
    errorMessage:
      errors?.[parentName]?.[name] &&
      i18n.t('common.formErrorsMessage.requiredInputs', {
        inputName: lowerCase(name),
      }),
  };

  const controllerSharedConfig = {
    name: `${parentName}.${name}`,
    key: name,
    control: control,
    rules: { required: inputConfig.required },
  };

  switch (inputConfig.datatype) {
    case FormTypes.STRING:
      return (
        <Controller
          {...controllerSharedConfig}
          render={({ field: { ref, ...rest } }) => (
            <TextField {...rest} {...textFieldSharedConfig} inputRef={ref} />
          )}
        />
      );
    case FormTypes.DURATION:
    case FormTypes.INTEGER:
      return (
        <Controller
          {...controllerSharedConfig}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...textFieldSharedConfig}
              inputRef={ref}
              type="number"
            />
          )}
        />
      );
    default:
      throw new Error(
        i18n.t('pages.apps.form.errors.inputTypeDoesntExist', {
          fieldType: inputConfig.datatype,
        })
      );
  }
};

export const buildForm = ({
  errors,
  control,
  config,
  connectorKey,
}: {
  errors: ObjectOf<any>;
  control: any;
  config: ConnectorConfigFormProps;
  connectorKey: keyof ConnectorConfigFormProps;
}) =>
  Object.entries(config[connectorKey]).map(([key, value]) =>
    inputsFactory({
      inputConfig: value,
      name: key,
      control,
      errors,
      label: key,
      parentName: connectorKey,
    })
  );
