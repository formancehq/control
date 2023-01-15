import React, { FunctionComponent, useEffect } from 'react';

import { Add } from '@mui/icons-material';
import { Box, SelectChangeEvent } from '@mui/material';
import { get, isEmpty, pickBy, toInteger } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Select } from '@numaryhq/storybook';

import { buildForm, FormTypes } from '~/routes/connectors/apps/formBuilder';
import {
  APP_ROUTE,
  APPS_ROUTE,
  getRoute,
} from '~/src/components/Layout/routes';
import Modal from '~/src/components/Wrappers/Modal';
import { useService } from '~/src/hooks/useService';
import { Connector, ConnectorFormValues } from '~/src/types/connectorsConfig';
import { ObjectOf } from '~/src/types/generic';
import { API_PAYMENT } from '~/src/utils/api';
import { lowerCaseAllWordsExceptFirstLetter } from '~/src/utils/format';

export type CreateFormProps = {
  connectors: Connector[] | [];
  configuration: ObjectOf<any>;
};

export const CreateForm: FunctionComponent<CreateFormProps> = ({
  configuration,
  connectors,
}) => {
  const { t } = useTranslation();
  const { api, snackbar } = useService();
  const initFormWithDefaultValues = Object.entries(configuration).reduce(
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
    setError,
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      connectorSelect: '',
      ...initFormWithDefaultValues,
    },
  });
  const navigate = useNavigate();

  const formattedConnectorConfig = Object.keys(configuration).map((key) => ({
    id: key,
    label: lowerCaseAllWordsExceptFirstLetter(key),
  }));

  const connectorKey = watch('connectorSelect');

  const onSave = async () => {
    const valid = await trigger();
    if (!valid) {
      return null;
    }

    const connectorConfig = get(configuration, connectorKey);
    const values = getValues(connectorKey);
    Object.keys(values).map((key) => {
      if (!isEmpty(values[key])) {
        const currentKey = get(connectorConfig, key);
        if (currentKey) {
          switch (currentKey.dataType) {
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
        navigate(getRoute(APP_ROUTE, connectorKey.toLowerCase()));
      }
    } catch {
      navigate(getRoute(APPS_ROUTE));
      snackbar(
        t('pages.apps.form.errors.error', {
          connectorName: lowerCaseAllWordsExceptFirstLetter(connectorKey),
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
        title: t('pages.connectors.dialog.connectTitle'),
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
                errorMessage={errors.connectorSelect?.message as string}
                select={{
                  ref: ref,
                  inputRef: ref,
                  onChange: (e: SelectChangeEvent<any>) => {
                    const alreadyExist = connectors.find(
                      (connector) => connector.provider === e.target.value
                    );
                    if (alreadyExist) {
                      setError('connectorSelect', {
                        type: 'custom',
                        message: t(
                          'pages.apps.form.connectorsSelect.errors.duplicated',
                          {
                            connector: e.target.value.toLowerCase(),
                          }
                        ),
                      });
                    } else {
                      onChange(e);
                    }
                  },
                }}
              />
            )}
          />
        </Box>

        {connectorKey &&
          buildForm({
            config: configuration,
            connectorKey,
            control,
            errors,
          })}
      </form>
    </Modal>
  );
};
