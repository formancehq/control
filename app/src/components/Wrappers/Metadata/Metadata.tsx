import React, { FunctionComponent } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Edit } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { MetadataProps } from './types';

import { Code, JsonViewer, SectionWrapper } from '@numaryhq/storybook';

import Modal from '../Modal';

import {
  FormInput,
  prettyJson,
  schema,
  submit,
} from '~/src/components/Wrappers/Metadata/service';
import { useService } from '~/src/hooks/useService';

const Metadata: FunctionComponent<MetadataProps> = ({
  metadata,
  title,
  resource,
  id,
  sync,
}) => {
  const { t } = useTranslation();
  const { api } = useService();
  const {
    getValues,
    formState: { errors },
    setValue,
    control,
    trigger,
  } = useForm<FormInput>({ resolver: yupResolver(schema), mode: 'onChange' });
  const { ledgerId } = useParams<{
    ledgerId: string;
  }>();
  // TODO use it with FunctionAction from remix
  const onSave = async () => {
    const validated = await trigger('json');
    if (validated) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await submit(JSON.parse(getValues('json')), id, resource, ledgerId!, api);
      sync();
    }
  };

  const renderRowActions = (metadata: string) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Modal
        button={{
          id: `edit-${id}-button`,
          onClick: () => {
            setValue('json', metadata, {
              shouldValidate: true,
            });
          },
          variant: 'dark',
          endIcon: <Edit />,
        }}
        modal={{
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.metadata.update'),
          actions: {
            cancel: {
              label: t('common.dialog.cancelButton'),
            },
            save: {
              onClick: onSave,
              label: t('common.dialog.saveButton'),
              disabled: !!errors.json,
            },
          },
        }}
      >
        <form>
          <Box>
            <Controller
              name="json"
              control={control}
              render={({ field }) => (
                <Code
                  code={field.value}
                  editor
                  error={!!errors.json}
                  errorMessage={errors.json?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>
        </form>
      </Modal>
    </Box>
  );

  return (
    <SectionWrapper title={title}>
      <Box
        sx={{
          display: 'flex',
          background: ({ palette }) => palette.neutral[900],
          justifyContent: 'space-between',
          alignItems: 'self-start',
          borderRadius: '6px',
          p: '12px',
          '& ul': {
            marginTop: '0px !important',
          },
          '& li': {
            fontFamily: ({ typography }) => typography.fontFamily,
            fontSize: ({ typography }) => typography.body1.fontSize,
          },
        }}
      >
        <JsonViewer jsonData={metadata} />
        {renderRowActions(prettyJson(metadata))}
      </Box>
    </SectionWrapper>
  );
};
export default Metadata;
