import React, { FunctionComponent } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, Date, JsonViewer, LoadingButton } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { CreateTransactionProps } from '~/src/components/Wrappers/Workflows/histories/stages/CreateTransaction/types';
import {
  chipContainer,
  containerSx,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const CreateTransaction: FunctionComponent<CreateTransactionProps> = ({
  reference,
  metadata,
  postCommitTransactions,
  postings,
  preCommitVolumes,
  timestamp,
  txid,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  const jsonContainer = {
    ...chipContainer,
    display: 'flex',
    flexDirection: 'column',
    '& li': {
      fontSize: '8px !important',
    },
  };

  return (
    <Box className="react-flow__nodes" sx={{ borderRadius: '50%' }}>
      <Box className="react-flow__node-default">
        <NodeTitle label={`Txid ${txid}`} color={palette.violet.light} />
        {!show && (
          <LoadingButton
            content="Show more"
            variant="stroke"
            onClick={() => toggle()}
            sx={{
              fontSize: '8px',
              height: 25,
              width: '100%',
              borderRadius: '4px',
            }}
          />
        )}
        {show && (
          <>
            <Box component="span" display="block" pl={1} sx={containerSx}>
              <Box sx={chipContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.createTransaction.reference')}
                </Typography>
                <Chip label={reference} variant="square" color="green" />
              </Box>
              <Box sx={chipContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.createTransaction.timestamp')}
                </Typography>
                <Date timestamp={timestamp} />
              </Box>
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.createTransaction.metadata')}
                </Typography>
                <JsonViewer jsonData={metadata} expanded />
              </Box>
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.createTransaction.postCommitTransactions')}
                </Typography>
                <JsonViewer jsonData={postCommitTransactions} expanded />
              </Box>
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.createTransaction.preCommitVolumes')}
                </Typography>
                <JsonViewer jsonData={preCommitVolumes} expanded />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CreateTransaction;
