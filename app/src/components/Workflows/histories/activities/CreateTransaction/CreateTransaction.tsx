import React, { FunctionComponent } from 'react';

import { SwapHoriz } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Chip, CopyPasteTooltip, Date, JsonViewer } from '@numaryhq/storybook';

import { getLedgerTransactionDetailsRoute } from '~/src/components/Layout/routes';
import NodeTitle from '~/src/components/Workflows/CustomNode/NodeTitle';
import { CreateTransactionProps } from '~/src/components/Workflows/histories/activities/CreateTransaction/types';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
  jsonContainer,
  placeholderSx,
  typoSx,
} from '~/src/components/Workflows/stages/utils';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
import { useToggle } from '~/src/hooks/useToggle';

const CreateTransaction: FunctionComponent<CreateTransactionProps> = ({
  reference,
  metadata,
  postCommitTransactions,
  preCommitVolumes,
  timestamp,
  txid,
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
        border: ({ palette }) => `1px dotted ${palette.violet.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.createTransaction.title')}
        color={palette.violet.light}
        onToggle={toggle}
        icon={<SwapHoriz />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx} mt={1}>
            <Box sx={chipContainer(reference)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.createTransaction.reference')}
              </Typography>
              <CopyPasteTooltip
                tooltipMessage={t('common.tooltip.copied')}
                value={reference}
              >
                <Chip
                  label={getPlaceholder(reference)}
                  variant="square"
                  color="green"
                  sx={{ overflow: 'hidden' }}
                />
              </CopyPasteTooltip>
            </Box>
            <Box sx={chipContainer(`${txid}`)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.createTransaction.txid')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(`${txid}`)}
                color="blue"
                route={
                  ledger
                    ? getLedgerTransactionDetailsRoute(txid, ledger)
                    : undefined
                }
              />
            </Box>
            <Box sx={chipContainer()}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.createTransaction.timestamp')}
              </Typography>
              {timestamp ? (
                <Date timestamp={timestamp} />
              ) : (
                <Typography variant="placeholder" sx={placeholderSx}>
                  {getPlaceholder()}
                </Typography>
              )}
            </Box>
            {!isEmpty(metadata) && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.activities.createTransaction.metadata')}
                </Typography>
                <JsonViewer jsonData={metadata} expanded />
              </Box>
            )}
            {postCommitTransactions && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t(
                    'pages.flow.activities.createTransaction.postCommitTransactions'
                  )}
                </Typography>
                <JsonViewer jsonData={postCommitTransactions} expanded />
              </Box>
            )}
            {preCommitVolumes && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t(
                    'pages.flow.activities.createTransaction.preCommitVolumes'
                  )}
                </Typography>
                <JsonViewer jsonData={preCommitVolumes} expanded />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CreateTransaction;
