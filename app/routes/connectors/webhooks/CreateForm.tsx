import * as React from 'react';
import { FunctionComponent, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Add } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Chip, TextField } from '@numaryhq/storybook';

import { getRoute, WEBHOOK_ROUTE } from '~/src/components/Navbar/routes';
import Modal from '~/src/components/Wrappers/Modal';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';
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
  const [event, setEvent] = useState<string[]>([]);
  const { typography } = useTheme();

  const handleChange = (selectEvent: SelectChangeEvent<typeof event>) => {
    const {
      target: { value },
    } = selectEvent;
    setEvent(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const onSave = async () => {
    const validated = await trigger();
    if (validated) {
      const formValues = getValues();
      try {
        const webhook = await api.postResource<string>(
          `${API_WEBHOOK}/configs`,
          formValues
        );
        if (webhook) {
          navigate(getRoute(WEBHOOK_ROUTE, webhook));
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
              setEvent([]);
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
          render={({ field: { onChange, ref, ...rest } }) => (
            <FormControl sx={{ mt: 1, width: 548 }}>
              <InputLabel id="event-label" shrink>
                {t('pages.webhooks.form.create.eventTypes.label')}
              </InputLabel>
              <Select
                {...rest}
                labelId="event-label"
                multiple
                value={event}
                onChange={(event) => {
                  handleChange(event);
                  onChange(event);
                }}
                input={
                  <OutlinedInput
                    ref={ref}
                    notched
                    id="select-event"
                    label={t('pages.webhooks.form.create.eventTypes.label')}
                    sx={{ height: event.length > 2 ? 'auto' : '40px' }}
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} variant="square" />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                      width: 250,
                    },
                  },
                }}
              >
                {events.map((currentEvent) => (
                  <MenuItem
                    key={currentEvent}
                    value={currentEvent}
                    style={{
                      fontWeight:
                        event.indexOf(currentEvent) === -1
                          ? typography.body1.fontWeight
                          : 500,
                    }}
                  >
                    {currentEvent}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </form>
    </Modal>
  );
};
