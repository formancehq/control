import React, { FunctionComponent, memo } from 'react';

import { Schema } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Handle, Position } from 'reactflow';

import { RootNodeProps } from './types';

const RootNode: FunctionComponent<RootNodeProps> = ({ isConnectable }) => (
  <div className="root-node">
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        background: ({ palette }) => palette.neutral[700],
        height: 25,
        width: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Schema color="secondary" />
    </Box>
    <Handle
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
    />
  </div>
);

export default memo(RootNode);
