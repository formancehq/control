import React, { FunctionComponent, useEffect } from 'react';

import { Add } from '@mui/icons-material';
import { isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Select } from '@numaryhq/storybook';

import Modal from '~/src/components/Wrappers/Modal';
import { buildForm } from '~/src/utils/formBuilder/formBuilder';

const connectorsConfig = {
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

export const CreateConnectorsForm: FunctionComponent = () => {
  const { t } = useTranslation();

  const formattedConnectorConfig = Object.keys(connectorsConfig).map((key) => ({
    id: key,
    label: key,
  }));

  const {
    getValues,
    trigger,
    formState: { errors, isValid },
    control,
    clearErrors,
    reset,
    watch,
    handleSubmit,
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      connectorSelect: '',
      modulr: {
        apiKey: '',
        apiSecret: '',
        endpoint: '',
      },
    },
  });

  const connectorKey = watch('connectorSelect');

  // const handleOpeningModal = () => {
  //   setIsModalOpen(true);
  // };

  const onSave = async () => {
    await trigger();

    console.log(getValues(), !isEmpty(errors), { errors });
    if (!isEmpty(errors)) {
      return null;
    }
    console.log('closed');
    reset();
  };

  useEffect(() => {
    clearErrors();
  }, [connectorKey]);

  return (
    <Modal
      button={{
        id: 'create',
        variant: 'dark',
        startIcon: <Add />,
        content: t('pages.connectors.tabs.apps.pageButton.actionLabel'),
      }}
      modal={{
        id: 'create-apps-modal',
        PaperProps: { sx: { minWidth: '500px' } },
        title: t('common.dialog.createTitle'),
        actions: {
          cancel: {
            onClick: async () => {
              reset();
            },
          },
          save: {
            onClick: onSave,
            disabled: !isValid,
          },
        },
      }}
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Controller
          name="connectorSelect"
          control={control}
          rules={{ required: true }}
          render={({ field: { ref, onChange, ...rest } }) => (
            <Select
              {...rest}
              items={formattedConnectorConfig}
              placeholder={t('common.forms.selectEntity', {
                entityName: 'connector',
              })}
              error={!!errors.connectorSelect}
              select={{
                ref: ref,
                inputRef: ref,
                onChange: onChange,
              }}
            />
          )}
        />
        {connectorKey && buildForm({ connectorKey, control, errors })}
      </form>
    </Modal>
  );
};
