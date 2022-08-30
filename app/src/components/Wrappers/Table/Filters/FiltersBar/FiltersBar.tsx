import React, { FunctionComponent, ReactElement } from 'react';
import { Box } from '@mui/material';

const FiltersBar: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => (
  <Box display="flex" id="filters-bar" mb="26px" gap="26px">
    {children}
  </Box>
);

export default FiltersBar;
