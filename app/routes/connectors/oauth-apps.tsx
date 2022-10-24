import * as React from 'react';

import { Box } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
// import { useTranslation } from 'react-i18next';

export const meta: MetaFunction = () => ({
  title: 'OauthApps',
  description: 'OauthApps',
});

export default function Index() {
  //const { t } = useTranslation();

  return <Box>oauth-clients</Box>;
}
