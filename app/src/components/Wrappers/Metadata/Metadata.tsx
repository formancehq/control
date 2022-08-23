import React, { FunctionComponent } from 'react';
import { MetadataProps } from './types';
import {
  JsonViewer,
  LoadingButton,
  Row,
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
import Table from '~/src/components/Wrappers/Table';

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

  const onSave = async () => {
    const validated = await trigger('json');
    if (validated) {
      await submit(JSON.parse(getValues('json')), id, resource, api);
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
    <div>
      <Modal
        button={{
          id: `edit-${id}-button`,
          onClick: () => {
            setValue('json', `${metadata.value}`, {
              shouldValidate: true,
            });
          },
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
    </div>
  );

  return (
    <SectionWrapper title={title}>
      <Box
        sx={{
          '& td': { background: ({ palette }) => palette.neutral[900] },
        }}
      >
        <Table
          withPagination={false}
          items={metadata}
          action={true}
          columns={[
            {
              key: 'metadata.value',
              label: t('common.table.metadata.columnLabel.value'),
            },
          ]}
          renderItem={(metadataItem: MetadataType, index) => (
            <Row
              key={index}
              keys={[<JsonViewer key={index} jsonData={metadataItem.value} />]}
              item={metadataItem}
              renderActions={() => renderRowActions(metadataItem)}
            />
          )}
        />
      </Box>
    </SectionWrapper>
  );
};
export default Metadata;
