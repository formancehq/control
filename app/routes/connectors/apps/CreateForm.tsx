import React, { FunctionComponent, useEffect } from 'react';

import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import { get, pickBy, toInteger } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Select } from '@numaryhq/storybook';

import {
  buildForm,
  connectorsConfig,
  FormTypes,
} from '~/routes/connectors/apps/formBuilder';
import { APP_ROUTE, getRoute } from '~/src/components/Navbar/routes';
import Modal from '~/src/components/Wrappers/Modal';
import { useService } from '~/src/hooks/useService';
import { ConnectorFormValues } from '~/src/types/connectorsConfig';
import { ObjectOf } from '~/src/types/generic';
import { API_PAYMENT } from '~/src/utils/api';

export const CreateForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { api, snackbar } = useService();
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
  const navigate = useNavigate();

  const formattedConnectorConfig = Object.keys(connectorsConfig).map((key) => ({
    id: key,
    label: key,
  }));

  const connectorKey = watch('connectorSelect');

  const onSave = async () => {
    const valid = await trigger();
    if (!valid) {
      return null;
    }

    const config = get(connectorsConfig, connectorKey);
    const values = getValues(connectorKey);
    Object.keys(values).map((key) => {
      const currentKey = get(config, key);
      if (currentKey) {
        switch (currentKey.datatype) {
          case FormTypes.DURATION:
            values[key] = `${values[key]}s`;
            break;
          case FormTypes.INTEGER:
            values[key] = toInteger(values[key]);
            break;
          default:
            break;
        }
      }
    });
    const sanitizedValues: Partial<ConnectorFormValues> = pickBy(
      values,
      (value) => value.length > 0
    );

    try {
      const connector = await api.postResource<ObjectOf<any>>(
        `${API_PAYMENT}/connectors/${connectorKey}`,
        sanitizedValues
      );
      if (connector) {
        navigate(getRoute(APP_ROUTE, connectorKey));
      }
    } catch {
      snackbar(
        t('pages.apps.form.errors.errorOrDuplicate', {
          connectorName: connectorKey,
        })
      );
    }
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
        <Box mb={1}>
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
        </Box>

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
