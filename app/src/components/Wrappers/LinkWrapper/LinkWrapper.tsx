import React, { FunctionComponent } from 'react';
import { Box } from '@mui/material';
import { Link } from 'remix';
import { LinkWrapperProps } from './types';

const LinkWrapper: FunctionComponent<LinkWrapperProps> = ({
  children,
  prefetch,
  to,
  color,
}) => (
  <Box sx={{ '& a': { textDecoration: 'none', color: color } }}>
    <Link to={to} prefetch={prefetch}>
      {children}
    </Link>
  </Box>
);

export default LinkWrapper;
