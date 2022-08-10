import { NotificationsOutlined } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import * as React from 'react';
import { FunctionComponent } from 'react';

export const NotificationSection: FunctionComponent = () => (
  <Box mr={2} display="flex">
    <Tooltip title="topbar.notifications.tooltip">
      <NotificationsOutlined
        color="secondary"
        sx={{
          fontSize: '28px',
        }}
      />
    </Tooltip>
  </Box>
);
export default NotificationSection;
