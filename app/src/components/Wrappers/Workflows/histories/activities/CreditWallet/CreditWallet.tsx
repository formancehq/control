import React, { FunctionComponent } from 'react';

import { Wallet } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, JsonViewer } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { CreditWalletProps } from '~/src/components/Wrappers/Workflows/histories/activities/CreditWallet/types';
import {
  chipContainer,
  containerSx,
  jsonContainer,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const CreditWallet: FunctionComponent<CreditWalletProps> = ({
  metadata,
  amount,
  balance,
  sources,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.blue.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.creditWallet.title')}
        color={palette.blue.light}
        onToggle={toggle}
        icon={<Wallet />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx} mt={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.creditWallet.amount')}
              </Typography>
              <Chip
                label={`${amount.amount} ${amount.asset}`}
                variant="square"
                color="red"
              />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.creditWallet.balance')}
              </Typography>
              <Chip label={balance} variant="square" color="violet" />
            </Box>
            <Box id="container">
              <Box>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.activities.creditWallet.sources')}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                {sources.map((source, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      border: ({ palette }) =>
                        `1px dotted ${palette.neutral[200]}`,
                      borderRadius: '6px',
                      display: 'flex',
                      textAlign: 'center',
                      justifyContent: 'space-around',
                      p: 1,
                    }}
                  >
                    <Box>
                      <Typography sx={typoSx} variant="bold" mr={1}>
                        {t('pages.flow.activities.creditWallet.identifier')}
                      </Typography>
                      <Chip label={source.identifier} variant="square" />
                    </Box>
                    <Box>
                      <Typography sx={typoSx} variant="bold" mr={1}>
                        {t('pages.flow.activities.creditWallet.type')}
                      </Typography>
                      <Chip label={source.type} variant="square" />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={jsonContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.creditWallet.metadata')}
              </Typography>
              <JsonViewer jsonData={metadata} expanded />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CreditWallet;
