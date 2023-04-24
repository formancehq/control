import React, { FunctionComponent, memo } from 'react';

import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Handle, Position } from 'reactflow';

import { ActivitiesWrapperProps } from './types';

import CustomNode from '~/src/components/Wrappers/Workflows/CustomNode/CustomNode';
import SequentialNode from '~/src/components/Wrappers/Workflows/CustomNode/SequentialNode/SequentialNode';

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
      <Box
        className=""
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderStyle: 'dotted',
          borderRadius: '14px',
          borderColor: 'transparent',
        }}
      >
        {details.activities.map((a: any, index: number) => (
          <Box
            mb={1}
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CustomNode
              width={250}
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
            {index < details.activities.length - 1 && (
              <Box
                mt={1}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    height: 10,
                    width: '1px',
                    borderLeftColor: ({ palette }) => palette.neutral[600],
                    borderLeftWidth: 1,
                    borderLeftStyle: 'dotted',
                  }}
                />
                <SequentialNode
                  data={{ label: (index + 1).toString() }}
                  isConnectable={false}
                />
                <Box
                  sx={{
                    height: 10,
                    width: '1px',
                    borderLeftColor: ({ palette }) => palette.neutral[600],
                    borderLeftWidth: 1,
                    borderLeftStyle: 'dotted',
                  }}
                />
              </Box>
            )}
          </Box>
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
