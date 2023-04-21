import React, { FunctionComponent, memo } from 'react';

import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Handle, Position } from 'reactflow';

import { ActivitiesWrapperProps } from './types';

import CustomNode from '~/src/components/Wrappers/Workflows/CustomNode/CustomNode';

const ActivitiesWrapper: FunctionComponent<ActivitiesWrapperProps> = ({
  data: { details },
  isConnectable,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <Box className="activities-wrapper-node" sx={{ width: '100%' }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Box className="react-flow__node-default">
        {details.activities.map((a: any, index: number) => (
          <CustomNode
            key={index}
            data={{
              details: {
                ...a,
              },
              label: a.name,
              isLowLevel: true,
              isHighLevel: false,
            }}
            isConnectable
            id={`${index}`}
            type={a.name}
          />
        ))}
      </Box>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </Box>
  );
};

export default memo(ActivitiesWrapper);
