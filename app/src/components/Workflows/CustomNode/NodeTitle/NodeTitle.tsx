import React, { FunctionComponent } from 'react';

import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { LoadingButton } from '@numaryhq/storybook';

import { NodeTitleProps } from '~/src/components/Workflows/CustomNode/NodeTitle/types';
import { useToggle } from '~/src/hooks/useToggle';

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  label,
  color,
  onToggle,
  icon,
}) => {
  const [expanded, expand] = useToggle(false);
  const expandIcon = expanded ? <ExpandMore /> : <ChevronRight />;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0.5,
        background: ({ palette }) => (color ? color : palette.neutral[100]),
        borderRadius: '6px',
        height: 42,
      }}
    >
      <Box
        component="span"
        pr={1}
        display="flex"
        alignItems="center"
        sx={{
          '& .MuiSvgIcon-root': {
            width: '0.7em',
            height: '0.7em',
          },
        }}
      >
        {icon}
      </Box>
      <Typography>{label}</Typography>
      {onToggle && (
        <LoadingButton
          startIcon={expandIcon}
          sx={{ p: 0, m: 0 }}
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
