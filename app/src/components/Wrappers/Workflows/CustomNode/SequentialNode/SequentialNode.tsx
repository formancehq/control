import React, { FunctionComponent, memo } from 'react';

import { Box } from '@mui/material';
import { Handle, Position } from 'reactflow';

import { SequentialNodeProps } from './types';

const SequentialNode: FunctionComponent<SequentialNodeProps> = ({
  isConnectable,
  data: { label },
}) => (
  <div className="root-node">
    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
    />
    <Box
      className="react-flow__node-default"
      sx={{
        background: ({ palette }) => palette.neutral[600],
        color: ({ palette }) => palette.neutral[50],
        height: 15,
        width: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
      }}
    >
      {label}
    </Box>
    <Handle
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
    />
  </div>
);

export default memo(SequentialNode);
