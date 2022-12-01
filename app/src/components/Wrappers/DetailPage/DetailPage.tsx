import * as React from 'react';
import { FunctionComponent } from 'react';

import { Box } from '@mui/material';

import { theme } from '@numaryhq/storybook';

import { DetailPageProps } from '~/src/components/Wrappers/DetailPage/types';

const DetailPage: FunctionComponent<DetailPageProps> = ({ children }) => (
  <Box mt="26px">
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '6px',
        padding: '0 26px 26px 26px',
        backgroundColor: theme.palette.neutral[0],
      }}
    >
      {children}
    </Box>
  </Box>
);

export default DetailPage;
