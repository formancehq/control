import * as React from 'react';
import { FunctionComponent } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Add } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { SelectMultiple, TextField } from '@numaryhq/storybook';

import { getRoute, WEBHOOK_ROUTE } from '~/src/components/Layout/routes';
import Modal from '~/src/components/Wrappers/Modal';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';
import { Webhook } from '~/src/types/webhook';
import { API_WEBHOOK } from '~/src/utils/api';
import { validateURL } from '~/src/utils/validators';

const events = [
  'ledger.committed_transactions',
  'ledger.saved_metadata',
  'ledger.updated_mapping',
  'ledger.reverted_transaction',
  'payments.saved_payment',
];

export type CreateWebhook = {
  endpoint: string;
  eventTypes: string[];
};

export const schema = yup.object({
  endpoint: yup
    .mixed()
    .test(
      'endpoint',
      i18n.t('pages.webhooks.form.create.endpoint.errors.valid'),
      (value) => validateURL(value)
    ),
  eventTypes: yup
    .mixed()
    .test(
      'eventTypes',
      i18n.t('pages.webhooks.form.create.eventTypes.errors.valid'),
      (value) => value.length >= 1
    ),
});

export const CreateForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { api, snackbar } = useService();
  const {
    getValues,
    formState: { errors, isValid },
    control,
    trigger,
    reset,
  } = useForm<CreateWebhook>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      endpoint: '',
      eventTypes: [],
    },
  });

  const onSave = async () => {
    const validated = await trigger();
    if (validated) {
      const formValues = getValues();
      try {
        const webhook = await api.postResource<Webhook>(
          `${API_WEBHOOK}/configs`,
          formValues,
          'data'
        );
        if (webhook) {
          navigate(getRoute(WEBHOOK_ROUTE, webhook.id));
        }
      } catch {
        snackbar(
          t('common.feedback.create', {
            item: `${t('pages.webhook.title')} ${formValues.endpoint}`,
          })
        );
      }
    }
  };

  return (
    <Modal
      button={{
        id: 'create',
        variant: 'dark',
        startIcon: <Add />,
        content: t('pages.connectors.tabs.webhooks.pageButton.actionLabel'),
      }}
      modal={{
        id: 'create-webhook-modal',
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
      <form>
        <Controller
          name="endpoint"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              inputRef={ref}
              fullWidth
              required
              error={!!errors.endpoint}
              errorMessage={errors.endpoint?.message}
              label={t('pages.webhooks.form.create.endpoint.label')}
            />
          )}
        />
        <Controller
          name="eventTypes"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <SelectMultiple
              label={t('pages.webhooks.form.create.eventTypes.label')}
              items={events}
              outlinedInputLabel="events"
              ref={ref}
              onChange={onChange}
              id="events"
              error={!!errors.eventTypes}
              errorMessage={errors.eventTypes?.message}
            />
          )}
        />
      </form>
    </Modal>
  );
};
