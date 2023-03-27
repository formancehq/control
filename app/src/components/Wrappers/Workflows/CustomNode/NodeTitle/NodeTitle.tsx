import React, { FunctionComponent } from 'react';

import { Typography } from '@mui/material';

import { NodeTitleProps } from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle/types';

const NodeTitle: FunctionComponent<NodeTitleProps> = ({ label, color }) => (
  <Typography
    sx={{
      p: 0.5,
      background: ({ palette }) => (color ? color : palette.neutral[50]),
      mb: 1,
      borderRadius: '4px',
    }}
  >
    {label}
  </Typography>
);

export default NodeTitle;
