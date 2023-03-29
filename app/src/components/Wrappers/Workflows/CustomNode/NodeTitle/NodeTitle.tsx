import React, { FunctionComponent } from 'react';

import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { LoadingButton } from '@numaryhq/storybook';

import { NodeTitleProps } from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle/types';
import { useToggle } from '~/src/hooks/useToggle';

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  label,
  color,
  onToggle,
}) => {
  const [expanded, expand] = useToggle(false);
  const icon = expanded ? <ExpandMore /> : <ChevronRight />;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0.5,
        background: ({ palette }) => (color ? color : palette.neutral[50]),
        borderRadius: '6px',
      }}
    >
      <Typography>{label}</Typography>
      {onToggle && (
        <LoadingButton
          startIcon={icon}
          variant="transparent"
          onClick={() => {
            expand();
            onToggle();
          }}
        />
      )}
    </Box>
  );
};

export default NodeTitle;
