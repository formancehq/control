import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
// import { useTranslation } from 'react-i18next';

export const meta: MetaFunction = () => ({
  title: 'Connectors',
  description: 'Connectors',
});

export default function Index() {
  //const { t } = useTranslation();

  return <Box>Connectors</Box>;
}
