import React, { FunctionComponent, useEffect } from 'react';

import { Add } from '@mui/icons-material';
import { isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Select } from '@numaryhq/storybook';

import {
  buildForm,
  connectorsConfig,
} from '~/routes/connectors/apps/formBuilder';
import Modal from '~/src/components/Wrappers/Modal';

export const CreateConnectorsForm: FunctionComponent = () => {
  const { t } = useTranslation();

  const formattedConnectorConfig = Object.keys(connectorsConfig).map((key) => ({
    id: key,
    label: key,
  }));

  const defaultValuesFromConfig = Object.entries(connectorsConfig).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Object.entries(value).reduce(
        (acc, [key]) => ({
          ...acc,
          [key]: '',
        }),
        {}
      ),
    }),
    {}
  );

  const {
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
      ...defaultValuesFromConfig,
    },
  });

  const connectorKey = watch('connectorSelect');

  // const handleOpeningModal = () => {
  //   setIsModalOpen(true);
  // };

  const onSave = async () => {
    await trigger();
    if (!isEmpty(errors)) {
      return null;
    }
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
        {connectorKey &&
          buildForm({
            config: connectorsConfig,
            connectorKey,
            control,
            errors,
          })}
      </form>
    </Modal>
  );
};
