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
      datatype: 'int',
    },
  },
  wise: {
    apiKey: {
      datatype: 'string',
      required: true,
    },
  },
};

// export const buildSchema = (inputs: any) => {
//   const rule = (input: any) =>
//     input.required
//       ? yup.string().required(
//           i18n.t('common.input.required.error', {
//             value: input.value.toLowerCase(),
//           })
//         )
//       : yup.string();

//   return yup.object({
//     ...inputs.map((input: any) => ({
//       [input.name]: rule(input),
//     })),
//   });
// };

// console.log(buildSchema(connectorsConfig['dummypay']));

const inputsFactory = ({
  inputConfig,
  name,
  control,
  errors,
  label,
}: {
  inputConfig: { datatype: string; required?: boolean };
  name: string;
  control: any;
  errors: any;
  label: string;
}) => {
  switch (inputConfig.datatype) {
    case 'string':
      return (
        <Controller
          name={name}
          key={name}
          //   rules={{ ...(inputConfig.required && { required: true }) }}
          rules={{ required: true }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors[name]}
              errorMessage={
                errors[name] &&
                i18n.t('common.formErrorsMessage.requiredInputs', {
                  inputName: name.toLowerCase(),
                })
              }
              label={label}
            />
          )}
        />
      );
    case 'number':
      return <input type="number" name={name} />;
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
  connectorKey: 'stripe' | 'wise';
}) =>
  Object.entries(connectorsConfig[connectorKey]).map(([key, value]) =>
    inputsFactory({
      inputConfig: value,
      name: key,
      control,
      errors,
      label: key,
    })
  );
