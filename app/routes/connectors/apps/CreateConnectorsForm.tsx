import React, { FunctionComponent, useEffect, useState } from 'react';

import { Add } from '@mui/icons-material';
import { isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LoadingButton, Modal, Select } from '@numaryhq/storybook';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedConnectorConfig = Object.keys(connectorsConfig).map((key) => ({
    id: key,
    label: key,
  }));

  const {
    getValues,
    trigger,
    formState: { errors, isDirty },
    control,
    clearErrors,
    reset,
    watch,
    handleSubmit,
  } = useForm<any>({ mode: 'onChange' });

  const connectorKey = watch('connectorSelect');

  const handleClosingModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleOpeningModal = () => {
    setIsModalOpen(true);
  };

  const onSave = async () => {
    await trigger();

    console.log(getValues(), !isEmpty(errors), { errors });
    if (!isEmpty(errors)) {
      return null;
    }
    console.log('closed');
    reset();
    handleClosingModal();
  };

  useEffect(() => {
    console.log('connectorKey', connectorKey);
    clearErrors();
  }, [connectorKey]);

  return (
    <>
      <LoadingButton
        id="create"
        variant="dark"
        endIcon={<Add />}
        content={t('pages.connectors.tabs.apps.pageButton.actionLabel')}
        onClick={handleOpeningModal}
      />

      <Modal
        open={isModalOpen}
        onClose={() => handleClosingModal()}
        actions={{
          cancel: {
            onClick: handleClosingModal,
            label: t('common.dialog.cancelButton'),
          },
          save: {
            onClick: onSave,
            label: t('common.dialog.saveButton'),
            disabled: !isEmpty(errors) || !isDirty,
          },
        }}
        title={t('common.dialog.createTitle')}
        PaperProps={{ sx: { width: '500px' } }}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <Controller
            name="connectorSelect"
            control={control}
            rules={{ required: true }}
            render={({ field: { ref, onChange, ...rest } }) => (
              <Select
                items={formattedConnectorConfig}
                {...rest}
                // TODO replace trad
                placeholder="Select a connector"
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
    </>
  );
};
