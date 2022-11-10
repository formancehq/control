import React, { FunctionComponent, useEffect } from 'react';

import { Add } from '@mui/icons-material';
import { pickBy, isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Select } from '@numaryhq/storybook';

import {
  buildForm,
  connectorsConfig,
} from '~/routes/connectors/apps/formBuilder';
import Modal from '~/src/components/Wrappers/Modal';
import { SnackbarSetter } from '~/src/contexts/service';
import { useService } from '~/src/hooks/useService';
import { ConnectorFormValues } from '~/src/types/connectorsConfig';
import { ObjectOf } from '~/src/types/generic';
import { ApiClient, API_PAYMENT } from '~/src/utils/api';

export const submit = async (
  values: Partial<ConnectorFormValues>,
  connectorKey: keyof ConnectorFormValues,
  api: ApiClient,
  snackbar: SnackbarSetter,
  t: any
) => {
  try {
    await api.postResource<ObjectOf<any>>(
      `${API_PAYMENT}/connectors/${connectorKey}`,
      values
    );
    // TODO find a better way to refresh the page
    // await navigate('./apps', { replace: true });
  } catch {
    snackbar(
      t('pages.apps.form.errors.errorOrDuplicate', {
        connectorName: connectorKey,
      })
    );
  }
};

export const CreateConnectorForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { api, snackbar } = useService();

  const formattedConnectorConfig = Object.keys(connectorsConfig).map((key) => ({
    id: key,
    label: key,
  }));

  const initFormWithDefaultValues = Object.entries(connectorsConfig).reduce(
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
    getValues,
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
      ...initFormWithDefaultValues,
    },
  });

  const connectorKey = watch('connectorSelect');

  const onSave = async () => {
    await trigger();

    if (!isEmpty(errors)) {
      return null;
    }

    const sanitizedValues: Partial<ConnectorFormValues> = pickBy(
      getValues(connectorKey),
      (value) => value.length > 0
    );

    await submit(sanitizedValues, connectorKey, api, snackbar, t);
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
