import React, { FunctionComponent } from 'react';

import { Wallet } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { DebitWalletProps } from '~/src/components/Wrappers/Workflows/histories/activities/DebitWallet/types';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const DebitWallet: FunctionComponent<DebitWalletProps> = ({ amount }) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.red.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.debitWallet.title')}
        color={palette.red.light}
        onToggle={toggle}
        icon={<Wallet />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx} mt={1}>
            <Box sx={chipContainer(`${amount.amount} ${amount.asset}`)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.debitWallet.amount')}
              </Typography>
              <Chip
                label={getPlaceholder(`${amount.amount} ${amount.asset}`)}
                variant="square"
                color="red"
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DebitWallet;
