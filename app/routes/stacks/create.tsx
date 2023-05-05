import * as React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Page, Select, TextField } from '@numaryhq/storybook';

import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Layout/routes';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';

export const meta: MetaFunction = () => ({
  title: 'Stacks',
  description: 'Create first stack',
});

export type CreateStack = {
  name: string;
  regions: string;
};

export const schema = yup.object({
  name: yup
    .string()
    .required(i18n.t('pages.stack.form.create.name.errors.required')),
  region: yup
    .string()
    .required(i18n.t('pages.stack.form.create.region.errors.required')),
});

export default function Index() {
  const { snackbar } = useService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    getValues,
    formState: { errors },
    control,
    trigger,
    handleSubmit,
  } = useForm<CreateStack>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      regions: '',
    },
  });
  const onSave = async () => {
    const validated = await trigger('name');
    if (validated) {
      const formValues = getValues();
      const values = {
        regions: formValues.regions,
        name: formValues.name,
      };
      try {
        // make the call
        const stack = undefined;
        if (stack) {
          navigate(getRoute(OVERVIEW_ROUTE));
        }
      } catch {
        snackbar(
          t('common.feedback.create', {
            item: values.name,
          })
        );
      }
    }
  };

  return (
    <Page id="stack-creation">
      <Box
        sx={{
          border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
          borderRadius: '6px',
          p: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{ color: ({ palette }) => palette.neutral[400] }}
          mb={1}
        >
          Create your first stack
        </Typography>
        <form onSubmit={handleSubmit(onSave)}>
          <Box mb={1}>
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
                  label={t('pages.stacks.form.create.name.label')}
                />
              )}
            />
            <Controller
              name="regions"
              control={control}
              rules={{ required: true }}
              render={({ field: { ref, onChange, ...rest } }) => (
                <Select
                  {...rest}
                  items={[
                    { id: 1, label: 'regions1' },
                    { id: 2, label: 'regions2' },
                  ]}
                  placeholder={t('common.forms.selectEntity', {
                    entityName: 'region',
                  })}
                  error={!!errors.regions}
                  errorMessage={errors.regions?.message as string}
                  select={{
                    ref: ref,
                    inputRef: ref,
                  }}
                />
              )}
            />
          </Box>
        </form>
      </Box>
    </Page>
  );
}
