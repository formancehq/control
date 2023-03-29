import React, { FunctionComponent } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, Date, JsonViewer } from '@numaryhq/storybook';

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
    gap: 0,
    '& li': {
      fontSize: '8px !important',
    },
  };

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.violet.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label="Create Transaction"
        color={palette.violet.light}
        onToggle={toggle}
      />
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
  );
};

export default CreateTransaction;
