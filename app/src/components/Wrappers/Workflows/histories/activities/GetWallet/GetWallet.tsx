import React, { FunctionComponent } from 'react';

import { Wallet } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, Date, JsonViewer } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { GetWalletProps } from '~/src/components/Wrappers/Workflows/histories/activities/GetWallet/types';
import {
  chipContainer,
  containerSx,
  jsonContainer,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const GetWallet: FunctionComponent<GetWalletProps> = ({
  metadata,
  name,
  createdAt,
  ledger,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.yellow.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.getWallet.title')}
        color={palette.yellow.light}
        onToggle={toggle}
        icon={<Wallet />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.name')}
              </Typography>
              <Chip label={name} variant="square" color="blue" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.ledger')}
              </Typography>
              <Chip label={ledger} variant="square" color="brown" />
            </Box>
            <Box sx={jsonContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.createdAt')}
              </Typography>
              <Date timestamp={createdAt} />
            </Box>
            <Box sx={jsonContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.metadata')}
              </Typography>
              <JsonViewer jsonData={metadata} expanded />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GetWallet;
