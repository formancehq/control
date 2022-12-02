import React, { FunctionComponent, ReactElement } from 'react';

import { Box } from '@mui/material';

const FiltersBar: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => (
  <Box
    display="flex"
    id="filters-bar"
    mb="12px"
    gap="18px"
    borderRadius="6px"
    flexWrap="wrap"
    alignItems="center"
    alignSelf="center"
  >
    {children}
  </Box>
);

export default FiltersBar;
