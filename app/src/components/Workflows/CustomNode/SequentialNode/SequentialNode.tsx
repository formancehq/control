import React, { FunctionComponent, memo } from 'react';

import { Box } from '@mui/material';

import { SequentialNodeProps } from './types';

const SequentialNode: FunctionComponent<SequentialNodeProps> = ({
  data: { label },
}) => (
  <Box
    className="react-flow__node-default"
    sx={{
      background: ({ palette }) => palette.neutral[600],
      color: ({ palette }) => palette.neutral[50],
      height: 10,
      width: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    }}
  >
    {label}
  </Box>
);

export default memo(SequentialNode);
