import * as React from 'react';
import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Session } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { LoadingButton, Page, Select, TextField } from '@numaryhq/storybook';

import {
  createStack as stackCreateConfig,
  OVERVIEW_ROUTE,
} from '~/src/components/Layout/routes';
import ComponentErrorBoundary from '~/src/components/Wrappers/ComponentErrorBoundary';
import { buildOptions } from '~/src/components/Wrappers/Table/Filters/filters';
import { useService } from '~/src/hooks/useService';
import i18n from '~/src/translations';
import { ObjectOf } from '~/src/types/generic';
import { MembershipOrganization, MembershipRegion } from '~/src/types/stack';
import { createReactApiClient } from '~/src/utils/api.client';
import { createApiClient } from '~/src/utils/api.server';
import { handleResponse, withSession } from '~/src/utils/auth.server';
import {
  createFavoriteMetadata,
  updateUserMetadata,
} from '~/src/utils/membership';

export const meta: MetaFunction = () => ({
  title: 'Stacks',
  description: 'Create first stack',
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ComponentErrorBoundary
      id={stackCreateConfig.id}
      title="pages.stacks.title"
      error={error}
    />
  );
}
export const loader: LoaderFunction = async ({ request }) => {
  async function handleData(session: Session) {
    const api = await createApiClient(
      session,
      `${process.env.MEMBERSHIP_URL_API}`,
      true
    );

    const regions = await api.getResource<MembershipRegion[]>(
      '/regions',
      'data'
    );
    const organizations = await api.getResource<MembershipOrganization[]>(
      '/organizations',
      'data'
    );

    return { regions, organizations };
  }

  return handleResponse(await withSession(request, handleData));
};
export type CreateStack = {
  name: string;
  regionID: string;
  organization: string;
};

export const schema = yup.object({
  name: yup
    .string()
    .required(i18n.t('pages.stacks.form.create.name.errors.required')),
  regionID: yup
    .string()
    .required(i18n.t('pages.stacks.form.create.region.errors.required')),
  organization: yup
    .string()
    .required(i18n.t('pages.stacks.form.create.organization.errors.required')),
});

export default function Index() {
  const { snackbar, metas, currentUser, setService, abilities, ...rest } =
    useService();
  const [loading, _setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { regions, organizations } = useLoaderData<{
    regions: MembershipRegion[];
    organizations: MembershipOrganization[];
  }>() as unknown as {
    regions: MembershipRegion[];
    organizations: MembershipOrganization[];
  };
  const { typography, palette } = useTheme();
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
      regionID: '',
    },
  });
  const service = {
    ...rest,
    setService,
    snackbar,
    currentUser,
    metas,
    abilities: {
      ...abilities,
      shouldRedirectToStackOnboarding: false,
    },
  };

  const onSave = async () => {
    const validated = await trigger();
    if (validated) {
      const formValues = getValues();
      const values = {
        region: formValues.regionID,
        name: formValues.name,
        organization: formValues.organization,
      };
      try {
        if (currentUser) {
          const api = await createReactApiClient(
            `${metas.membership}/api`,
            true
          );
          const stack = await api.postResource<ObjectOf<any>>(
            `/organizations/${values.organization}/stacks`,
            formValues,
            'data'
          );

          if (stack) {
            const metadata = createFavoriteMetadata(stack.uri);
            const favorite = await updateUserMetadata(api, metadata, () =>
              setService({
                ...service,
                currentUser: { ...currentUser, metadata },
              })
            );
            if (favorite) {
              navigate(OVERVIEW_ROUTE);
            }
          }
        }
      } catch (e) {
        snackbar(
          t('common.feedback.create', {
            item: values.name,
          })
        );
      }
    }
  };

  return (
    <Page
      id="stack-creation"
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '276px',
            }}
          >
            <CircularProgress size={30} color="secondary" />
          </Box>
        ) : (
          <Box
            sx={{
              border: ({ palette }) => `1px solid ${palette.neutral[100]}`,
              borderRadius: '6px',
              p: 4,
              width: '600px',
            }}
          >
            <Typography
              variant="h2"
              sx={{ color: ({ palette }) => palette.neutral[400] }}
              mb={1}
            >
              {t('pages.stacks.form.create.title')}
            </Typography>
            <form onSubmit={handleSubmit(onSave)}>
              <Box mb={1} mt={3}>
                <Alert
                  severity="info"
                  sx={{
                    background: palette.blue.light,
                    color: palette.blue.normal,
                    border: '0 !important',
                    '.MuiAlert-message': {
                      ...typography.body1,
                    },
                  }}
                >
                  <Box component="span" sx={{ display: 'block' }}>
                    {t('pages.stacks.form.create.explainer')}
                  </Box>
                </Alert>
                <Box mb={2} mt={3}>
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
                </Box>
                <Box mb={3}>
                  <Controller
                    name="organization"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { ref, onChange, value, ...rest } }) => (
                      <Select
                        {...rest}
                        items={buildOptions(organizations.map((org) => org.id))}
                        placeholder={t('common.forms.selectEntity', {
                          entityName: 'organization',
                        })}
                        error={!!errors.organization}
                        errorMessage={errors.organization?.message as string}
                        select={{
                          disabled: organizations.length === 1,
                          ref: ref,
                          inputRef: ref,
                          value:
                            organizations.length === 1
                              ? organizations[0].id
                              : value,
                          onChange: onChange,
                        }}
                      />
                    )}
                  />
                </Box>
                <Box mb={3}>
                  <Controller
                    name="regionID"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { ref, onChange, ...rest } }) => (
                      <Select
                        {...rest}
                        items={buildOptions(
                          regions.map((regions) => regions.id)
                        )}
                        placeholder={t('common.forms.selectEntity', {
                          entityName: 'region',
                        })}
                        error={!!errors.regionID}
                        errorMessage={errors.regionID?.message as string}
                        select={{
                          ref: ref,
                          inputRef: ref,
                          onChange: onChange,
                        }}
                      />
                    )}
                  />
                </Box>
                <LoadingButton
                  variant="dark"
                  fullWidth
                  onClick={onSave}
                  content={t('pages.stacks.form.create.button')}
                />
              </Box>
            </form>
          </Box>
        )}
      </>
    </Page>
  );
}
