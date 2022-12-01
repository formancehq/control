import React, { FunctionComponent, ReactElement } from 'react';

import { Box } from '@mui/material';

const FiltersBar: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => (
  <Box
    display="flex"
    id="filters-bar"
    mb="-12px"
    p="8px 10px"
    gap="26px"
    borderRadius="6px"
    flexWrap="wrap"
    alignItems="center"
    alignSelf="center"
    sx={{ background: ({ palette }) => palette.neutral[0] }}
  >
    {children}
  </Box>
);

export default FiltersBar;
