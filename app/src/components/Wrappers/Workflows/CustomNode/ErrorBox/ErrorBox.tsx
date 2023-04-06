import React, { FunctionComponent } from 'react';

import { Alert, Box, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { ErrorBoxProps } from '~/src/components/Wrappers/Workflows/CustomNode/ErrorBox/types';

const ErrorBox: FunctionComponent<ErrorBoxProps> = ({ error }) => {
  const { t } = useTranslation();

  if (!error || isEmpty(error)) return null;

  return (
    <Box
      sx={{
        '.MuiPaper-root': {
          borderColor: ({ palette }) => palette.neutral[50],
        },
        '.MuiAlert-icon svg': {
          color: ({ palette }) => palette.red.bright,
        },
      }}
    >
      <Alert
        severity="info"
        sx={{
          fontSize: '8px',
          p: 1,
          lineHeight: '1.2',
          mt: 1,
        }}
        variant="outlined"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="money" sx={{ fontSize: '8px' }}>
            {t('pages.flow.error')}
          </Typography>
          <Typography
            variant="money"
            sx={{
              fontSize: '8px',
              background: ({ palette }) => palette.neutral[50],
              p: 1,
              mt: 1,
              borderRadius: '6px',
            }}
          >
            {error}
          </Typography>
        </Box>
      </Alert>
    </Box>
  );
};

export default ErrorBox;
