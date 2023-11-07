import React, { FunctionComponent } from 'react';

import { SwapHoriz } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import NodeTitle from '~/src/components/Workflows/CustomNode/NodeTitle';

const RevertTransaction: FunctionComponent = () => {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.brown.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.revertTransaction.title')}
        color={palette.brown.light}
        icon={<SwapHoriz />}
      />
    </Box>
  );
};

export default RevertTransaction;
