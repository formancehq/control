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

export const connectorsConfig = {
  dummypay: {
    directory: {
      datatype: 'string',
      required: true,
    },
    fileGenerationPeriod: {
      datatype: 'duration ns',
    },
    filePollingPeriod: {
      datatype: 'duration ns',
    },
  },
  modulr: {
    apiKey: {
      datatype: 'string',
      required: true,
    },
    apiSecret: {
      datatype: 'string',
      required: true,
    },
    endpoint: {
      datatype: 'string',
    },
  },
  stripe: {
    apiKey: {
      datatype: 'string',
      required: true,
    },
    pollingPeriod: {
      datatype: 'duration ns',
    },
    pageSize: {
      datatype: 'integer',
    },
  },
  wise: {
    apiKey: {
      datatype: 'string',
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
    case 'string':
      return (
        <Controller
          {...controllerSharedConfig}
          render={({ field: { ref, ...rest } }) => (
            <TextField {...rest} {...textFieldSharedConfig} inputRef={ref} />
          )}
        />
      );
    case 'duration ns':
    case 'integer':
      return (
        <Controller
          {...controllerSharedConfig}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              {...textFieldSharedConfig}
              inputRef={ref}
              type="number"
              endAdornment={
                inputConfig.datatype === 'duration ns' &&
                `${i18n.t('common.units.units.seconds')}`
              }
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
