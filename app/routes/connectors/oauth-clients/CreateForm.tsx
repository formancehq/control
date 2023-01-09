import * as React from 'react';
import { FunctionComponent } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { TextArea, TextField } from '@numaryhq/storybook';

import { getRoute, OAUTH_CLIENT_ROUTE } from '~/src/components/Layout/routes';
import Modal from '~/src/components/Wrappers/Modal';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';
import { OAuthClient } from '~/src/types/oauthClient';
import { API_AUTH } from '~/src/utils/api';

export type CreateOAuthClient = {
  name: string;
  description?: string;
  redirectUri?: string;
  postLogoutRedirectUri?: string;
};

export const schema = yup.object({
  name: yup
    .string()
    .required(i18n.t('pages.oAuthClients.form.create.name.errors.required')),
  description: yup.string(),
  redirectUri: yup.string(),
  postLogoutRedirectUri: yup.string(),
});

export const CreateForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { api, snackbar } = useService();
  const {
    getValues,
    formState: { errors, isDirty },
    control,
    trigger,
    reset,
  } = useForm<CreateOAuthClient>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      redirectUri: '',
      postLogoutRedirectUri: '',
    },
  });

  const onSave = async () => {
    const validated = await trigger('name');
    if (validated) {
      const formValues = getValues();
      const values = {
        description: formValues.description,
        name: formValues.name,
        redirectUris: [formValues.redirectUri],
        postLogoutRedirectUris: [formValues.postLogoutRedirectUri],
      };
      try {
        const client = await api.postResource<OAuthClient>(
          `${API_AUTH}/clients`,
          values,
          'data'
        );
        if (client && client.id) {
          navigate(getRoute(OAUTH_CLIENT_ROUTE, client.id));
        }
      } catch {
        snackbar(
          t('common.feedback.create', {
            item: `${t('pages.oAuthClient.title')} ${values.name}`,
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
        content: t('pages.connectors.tabs.oAuthClients.pageButton.actionLabel'),
      }}
      modal={{
        id: 'create-oauth-client-modal',
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
            disabled: !!errors.name || !isDirty,
          },
        },
      }}
    >
      <form>
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              inputRef={ref}
              fullWidth
              required
              error={!!errors.name}
              errorMessage={errors.name?.message}
              label={t('pages.oAuthClients.form.create.name.label')}
            />
          )}
        />
        <Controller
          name="redirectUri"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              inputRef={ref}
              fullWidth
              label={t('pages.oAuthClients.form.create.redirectUri.label')}
            />
          )}
        />
        <Controller
          name="postLogoutRedirectUri"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <TextField
              {...rest}
              inputRef={ref}
              fullWidth
              label={t(
                'pages.oAuthClients.form.create.postLogoutRedirectUri.label'
              )}
            />
          )}
        />
        <Box mt={1} sx={{ textarea: { width: '518px !important' } }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                minRows={10}
                placeholder={t(
                  'pages.oAuthClients.form.create.description.placeholder'
                )}
              />
            )}
          />
        </Box>
      </form>
    </Modal>
  );
};
