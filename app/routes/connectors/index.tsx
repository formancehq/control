import * as React from 'react';

import { Add } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction } from '@remix-run/server-runtime';
import { isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Row, Select } from '@numaryhq/storybook';

import { CONNECTORS_ROUTE } from '~/src/components/Navbar/routes';
import Modal from '~/src/components/Wrappers/Modal/Modal';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import Table from '~/src/components/Wrappers/Table';
import { ApiClient } from '~/src/utils/api';
import { buildForm } from '~/src/utils/formBuilder/formBuilder';

export const meta: MetaFunction = () => ({
  title: 'Connectors List',
  description: 'Connectors List',
});

export type CreateStripeConnector = {
  connector: string;
  pollingPeriod: string;
  secretKey: string;
  pageSize: string;
};

export type CreateDummyPayConnector = {
  filePollingPeriod: string;
  fileGenerationPeriod: string;
  directory: string;
};

export type CreateWiseConnector = {
  apiKey: string;
};

export type CreateModulrConnector = {
  apiKey: string;
  apiSecret: string;
  endpoint: string;
};

export type ConnectorParams =
  | CreateStripeConnector
  | CreateDummyPayConnector
  | CreateWiseConnector
  | CreateModulrConnector;

export const connectorsConfig = {
  dummypay: {
    directory: {
      datatype: 'string',
      required: true,
    },
    fileGenerationPeriod: {
      datatype: 'duration ns',
    },
    filePollingPeriod: {
      datatype: 'duration ns',
    },
  },
  modulr: {
    apiKey: {
      datatype: 'string',
      required: true,
    },
    apiSecret: {
      datatype: 'string',
      required: true,
    },
    endpoint: {
      datatype: 'string',
    },
  },
  stripe: {
    pollingPeriod: {
      datatype: 'duration ns',
    },
    apiKey: {
      datatype: 'string',
      required: true,
    },
    pageSize: {
      datatype: 'int',
    },
  },
  wise: {
    apiKey: {
      datatype: 'string',
      required: true,
    },
  },
};

export const submit = async (values: ConnectorParams, api: ApiClient) => {
  console.log({ values });
};
export const loader: LoaderFunction = async ({ request }) => {
  const connectors = [
    {
      id: '1',
      name: 'Stripe',
      description: 'Stripe',
      status: 'Active',
    },
  ];

  return { connectors };
};

export default function Index() {
  const { t } = useTranslation();
  const { connectors } = useLoaderData();

  const {
    getValues,
    formState: { errors },
    control,
    reset,
    watch,
    handleSubmit,
  } = useForm<any>({
    mode: 'onTouched',
  });

  const connectorKey = watch('connectorSelect');

  const onSave = async () => {
    console.log({ getValues });
  };

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}
      >
        <Modal
          button={{
            id: 'create',
            variant: 'dark',
            endIcon: <Add />,
            content: t('pages.connectors.tabs.apps.pageButton.actionLabel'),
          }}
          modal={{
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
                disabled: !isEmpty(errors),
              },
            },
          }}
        >
          <form onSubmit={handleSubmit(onSave)}>
            <Controller
              name="connectorSelect"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  items={[
                    {
                      id: 'modulr',
                      label: 'Modulr',
                    },
                    {
                      id: 'wise',
                      label: 'Wise',
                    },
                  ]}
                  {...field}
                  placeholder="Select connector"
                  error={!!errors.connectorSelect}
                  errorMessage="You must choose a value"
                  select={{
                    onChange: field.onChange,
                  }}
                />
              )}
            />
            {connectorKey && buildForm({ connectorKey, control, errors })}
          </form>
        </Modal>
      </Box>
      <Table
        id="connectors-list"
        items={connectors}
        action={true}
        withPagination={false}
        columns={[
          {
            key: 'name',
            label: t('pages.connectors.table.columnLabel.name'),
          },
          {
            key: 'status',
            label: t('pages.connectors.table.columnLabel.status'),
          },
        ]}
        renderItem={(connector: any, index: number) => (
          <Row
            key={index}
            keys={[
              <ProviderPicture key={index} provider={connector.name} />,
              <Box key={index}>{connector.status}</Box>,
            ]}
            item={connectors}
            renderActions={() => <MoreHorizIcon />}
          />
        )}
      />
    </Box>
  );
}
