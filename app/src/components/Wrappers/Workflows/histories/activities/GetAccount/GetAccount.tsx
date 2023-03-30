import React, { FunctionComponent } from 'react';

import { AccountTree } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { JsonViewer } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { GetAccountProps } from '~/src/components/Wrappers/Workflows/histories/activities/GetAccount/types';
import {
  containerSx,
  jsonContainer,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const GetAccount: FunctionComponent<GetAccountProps> = ({ metadata }) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.green.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.getAccount.title')}
        color={palette.green.light}
        onToggle={toggle}
        icon={<AccountTree />}
      />
      {show && (
        <>
          <Box component="span" display="block" pl={1} sx={containerSx}>
            <Box sx={jsonContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getAccount.metadata')}
              </Typography>
              <JsonViewer jsonData={metadata} expanded />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GetAccount;
