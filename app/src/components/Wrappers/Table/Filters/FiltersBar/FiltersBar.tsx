import React, { FunctionComponent, ReactElement } from 'react';
import { Box } from '@mui/material';

const FiltersBar: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => (
  <Box display="flex" id="filters-bar">
    {children}
  </Box>
);

export default FiltersBar;
