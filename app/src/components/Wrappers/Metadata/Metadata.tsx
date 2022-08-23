import React, { FunctionComponent } from 'react';
import { MetadataProps } from './types';
import {
  JsonViewer,
  LoadingButton,
  SectionWrapper,
  TextArea,
} from '@numaryhq/storybook';
import { Metadata as MetadataType } from '~/src/types/ledger';
import { Edit, LocalFlorist } from '@mui/icons-material';
import Modal from '../Modal';
import { useTranslation } from 'react-i18next';
import { useService } from '~/src/hooks/useService';
import { noop } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormInput,
  prettyJson,
  schema,
  submit,
} from '~/src/components/Wrappers/Metadata/service';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

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
      await submit(JSON.parse(getValues('json')), id, resource, ledgerId!, api);
      sync();
    }
  };

  const handlePrettify = () => {
    try {
      setValue('json', prettyJson(JSON.parse(getValues('json'))), {
        shouldValidate: true,
      });
    } catch (e) {
      noop();
    }
  };

  const renderRowActions = (metadata: MetadataType) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Modal
        button={{
          id: `edit-${id}-button`,
          onClick: () => {
            setValue('json', `${metadata.value}`, {
              shouldValidate: true,
            });
          },
          variant: 'dark',
          endIcon: <Edit />,
        }}
        modal={{
          PaperProps: { sx: { minWidth: '500px' } },
          title: t('common.dialog.updateTitle'),
          actions: {
            cancel: {
              onClick: noop,
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
          <Box display="flex" justifyContent="end" mb={1}>
            <LoadingButton
              startIcon={<LocalFlorist />}
              content={t('common.forms.metadata.json.prettify')}
              onClick={handlePrettify}
              variant="stroke"
            />
          </Box>
          <Controller
            name="json"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                aria-label="text-area"
                minRows={10}
                error={!!errors.json}
                errorMessage={errors.json?.message}
                placeholder={t('common.forms.metadata.json.placeholder')}
              />
            )}
          />
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
          p: '20px',
          '& ul': {
            marginTop: '0px !important',
          },
          '& li': {
            fontFamily: ({ typography }) => typography.fontFamily,
            fontSize: ({ typography }) => typography.body1.fontSize,
          },
        }}
      >
        <JsonViewer
          jsonData={[{ value: { metadata1: '250', metadata2: '350' } }]}
        />
        {renderRowActions(metadata)}
      </Box>
    </SectionWrapper>
  );
};
export default Metadata;
