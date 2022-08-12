import React, { FunctionComponent, useState } from 'react';
import { MetadataProps } from './types';
import { normalizeMetadata } from './utils';
import { JsonTextArea, SectionWrapper } from '@numaryhq/storybook';
import Table from '../Table';
import Row from '../Table/components/Row';
import { TableConfig } from '~/src/types/generic';
import { LedgerResources, Metadata as MetadataType } from '~/src/types/ledger';
import { ArrowRight } from '@mui/icons-material';
import Modal from '../Modal';
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { API_LEDGER, IApiClient } from '~/src/utils/api';
import { getCurrentLedger } from '~/src/utils/localStorage';
import { useService } from '~/src/hooks/useService';
import { noop } from 'lodash';

const submit = async (value: string, id: string, api: IApiClient) => {
  await api.postResource(
    `${API_LEDGER}/${getCurrentLedger()}/${
      LedgerResources.ACCOUNTS
    }/${id}/metadata`,
    { value }
  );
};

const Metadata: FunctionComponent<MetadataProps> = ({
  metadata,
  title,
  resource,
  id,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>();
  const { t } = useTranslation();
  const { api } = useService();

  const handleOnChange = async (value: string | undefined, error?: boolean) => {
    if (value) setValue(value);
    if (error) {
      setDisabled(error);
    }
  };

  const handleOnSave = async () => {
    if (!disabled && value) {
      await submit(value, id, api);
    }
  };

  const renderRowActions = (metadata: MetadataType) => (
    <Modal
      button={{
        id: `edit-${id}-button`,
        onClick: () => null,
        endIcon: <ArrowRight />,
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
            onClick: handleOnSave,
            label: t('common.dialog.saveButton'),
            disabled: disabled,
          },
        },
      }}
    >
      <Form method="post">
        <JsonTextArea
          button={{ label: t('common.metadata.prettify') }}
          textarea={{
            name: 'metadata',
            minRows: 20,
            placeholder: 'Add some metadata',
            json: metadata.value,
            onChange: handleOnChange,
            required: true,
          }}
        />
      </Form>
    </Modal>
  );

  return (
    <SectionWrapper title={title}>
      <Table
        withPagination={false}
        key={`${id}-metadata`}
        items={normalizeMetadata(metadata)}
        columns={[{ key: 'metadata.value' }, { key: TableConfig.ACTIONS }]}
        resource={`ledgers.${resource}.details`}
        renderItem={(m: MetadataType) => (
          <Row
            keys={['value']}
            item={m}
            renderActions={() => renderRowActions(m)}
          />
        )}
      />
    </SectionWrapper>
  );
};
export default Metadata;
