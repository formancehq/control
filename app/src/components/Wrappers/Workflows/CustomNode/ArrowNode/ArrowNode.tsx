import React, { FunctionComponent, memo } from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';

import { ArrowNodeProps } from './types';

const ArrowNode: FunctionComponent<ArrowNodeProps> = ({ isConnectable }) => (
  <Box>
    <Box
      sx={{
        borderBottom: ({ palette }) => `1px solid ${palette.neutral[400]}`,
        width: 110,
      }}
    />
    <ArrowRight
      sx={{
        position: 'absolute',
        top: '-11px',
        zIndex: 9,
        left: '95px',
        color: ({ palette }) => palette.neutral[500],
      }}
    />
  </Box>
);

export default memo(ArrowNode);
