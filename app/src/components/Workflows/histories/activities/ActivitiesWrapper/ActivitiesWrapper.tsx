import React, { FunctionComponent, memo } from 'react';

import { ArrowDropDown } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Handle, Position } from 'reactflow';

import { ActivitiesWrapperProps } from './types';

import CustomNode from '~/src/components/Workflows/CustomNode/CustomNode';
import SequentialNode from '~/src/components/Workflows/CustomNode/SequentialNode/SequentialNode';

const ActivitiesWrapper: FunctionComponent<ActivitiesWrapperProps> = ({
  data: { details },
  isConnectable,
}) => (
  <Box className="activities-wrapper-node" sx={{ width: '100%' }}>
    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
    />
    <Box
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
              isLowLevel: false,
              isHighLevel: false,
            }}
            isConnectable={false}
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
                  height: 15,
                  width: '1px',
                  borderLeftColor: ({ palette }) => palette.neutral[600],
                  borderLeftWidth: 1,
                  borderLeftStyle: 'solid',
                }}
              />
              <SequentialNode
                data={{ label: (index + 1).toString() }}
                isConnectable={false}
              />
              <Box
                sx={{
                  height: 15,
                  width: '1px',
                  borderLeftColor: ({ palette }) => palette.neutral[600],
                  borderLeftWidth: 1,
                  borderLeftStyle: 'solid',
                }}
              />
              <ArrowDropDown
                sx={{
                  color: ({ palette }) => palette.neutral[600],
                  mt: '-10px',
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

export default memo(ActivitiesWrapper);
