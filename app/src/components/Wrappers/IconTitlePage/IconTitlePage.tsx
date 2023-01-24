import * as React from 'react';
import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';

import { IconTitlePageProps } from '~/src/components/Wrappers/IconTitlePage/types';

const IconTitlePage: FunctionComponent<IconTitlePageProps> = ({
  title,
  icon,
  children,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Box
      sx={{
        '& .MuiSvgIcon-root': {
          opacity: 0.4,
          fontSize: '1.25rem',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        width: 32,
        height: 32,
        mr: 2,
        backgroundColor: (theme) => theme.palette.neutral[100],
        borderRadius: 1,
      }}
    >
      {icon}
    </Box>
    {title ? (
      <Typography variant="h1" pr={1}>
        {title}
      </Typography>
    ) : (
      children
    )}
  </Box>
);
export default IconTitlePage;
