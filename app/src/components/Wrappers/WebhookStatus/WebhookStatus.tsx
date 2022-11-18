import * as React from 'react';
import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Switch } from '@numaryhq/storybook';

import { WebhookStatusProps } from '~/src/components/Wrappers/WebhookStatus/types';
import { useService } from '~/src/hooks/useService';
import { API_WEBHOOK } from '~/src/utils/api';

const WebhookStatus: FunctionComponent<WebhookStatusProps> = ({
  webhook,
  onChangeCallback,
}) => {
  const { t } = useTranslation();
  const { api, snackbar } = useService();

  const onStatusChange = async () => {
    let result = undefined;
    const route = webhook.active ? 'deactivate' : 'activate';
    try {
      result = await api.putResource<unknown>(
        `${API_WEBHOOK}/configs/${webhook._id}/${route}`
      );
    } catch {
      snackbar(
        t('common.feedback.update', {
          item: `${t('pages.webhook.title')} ${webhook.endpoint}`,
        })
      );
    }
    if (result) {
      onChangeCallback();
    }
  };

  return (
    <Box
      component="span"
      display="inline-flex"
      alignItems="center"
      alignSelf="center"
    >
      <Typography>
        {t(
          `pages.webhooks.table.rows.${webhook.active ? 'active' : 'inactive'}`
        )}
      </Typography>
      <Switch
        checked={webhook.active}
        variant="blue"
        onChange={onStatusChange}
      />
    </Box>
  );
};

export default WebhookStatus;
