import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { TextField } from '@numaryhq/storybook';

import i18n from '~/src/translations';

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
    pollingPeriod: {
      datatype: 'duration ns',
    },
    apiKey: {
      datatype: 'string',
      required: true,
    },
    pageSize: {
      datatype: 'duration ns',
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
  inputConfig: { datatype: string; required?: boolean };
  name: string;
  control: any;
  errors: any;
  label: string;
  parentName: string;
}) => {
  const commonConfig = {
    label: label.toLocaleLowerCase(),
    fullWidth: true,
    required: inputConfig.required,
    error: !!errors?.[parentName]?.[name],
    errorMessage:
      errors?.[parentName]?.[name] &&
      i18n.t('common.formErrorsMessage.requiredInputs', {
        inputName: name.toLowerCase(),
      }),
  };

  switch (inputConfig.datatype) {
    case 'string':
      return (
        <Controller
          name={`${parentName}.${name}`}
          key={name}
          rules={{ required: inputConfig.required }}
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField {...rest} inputRef={ref} {...commonConfig} />
          )}
        />
      );
    case 'duration ns':
      return (
        <Controller
          name={`${parentName}.${name}`}
          key={name}
          rules={{ required: inputConfig.required }}
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              inputRef={ref}
              type="number"
              {...commonConfig}

              // TODO adapt the format so we can have a unit for the input
              // endAdornment="Seconds"
            />
          )}
        />
      );
    default:
      throw new Error('error');
  }
};

export const buildForm = ({
  errors,
  control,
  connectorKey,
}: {
  errors: any;
  control: any;
  connectorKey: 'stripe' | 'wise' | 'modulr' | 'dummypay';
}) =>
  Object.entries(connectorsConfig[connectorKey]).map(([key, value]) =>
    inputsFactory({
      inputConfig: value,
      name: key,
      control,
      errors,
      label: key,
      parentName: connectorKey,
    })
  );
