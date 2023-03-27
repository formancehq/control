import React, { FunctionComponent } from 'react';

import { AccountTree, CreditCard, Wallet } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SourceDestinationBoxProps } from './types';

import { Chip } from '@numaryhq/storybook';

import {
  chipContainer,
  containerSx,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import {
  OrchestrationStageInput,
  OrchestrationStageInputAccount,
  OrchestrationStageInputPayment,
  OrchestrationStageInputWallet,
} from '~/src/types/orchestration';

function isAccount(
  item: OrchestrationStageInput
): item is OrchestrationStageInputAccount {
  return (item as OrchestrationStageInputAccount).account !== undefined;
}

function isWallet(
  item: OrchestrationStageInput
): item is OrchestrationStageInputWallet {
  return (item as OrchestrationStageInputWallet).wallet !== undefined;
}

function isPayment(
  item: OrchestrationStageInput
): item is OrchestrationStageInputPayment {
  return (item as OrchestrationStageInputPayment).payment !== undefined;
}

const SourceDestinationBox: FunctionComponent<SourceDestinationBoxProps> = ({
  item,
}) => {
  const { t } = useTranslation();

  const handleDestinationOrSource = () => {
    if (isAccount(item)) {
      return (
        <Box sx={containerSx}>
          <Typography sx={{ fontSize: '10px' }}>
            <AccountTree
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.flow.send.account')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.id')}
              </Typography>
              <Chip label={item.account.id} variant="square" color="green" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.ledger')}
              </Typography>
              <Chip
                label={item.account.ledger}
                variant="square"
                color="green"
              />
            </Box>
          </Box>
        </Box>
      );
    }

    if (isWallet(item)) {
      return (
        <Box sx={containerSx}>
          <Typography sx={{ fontSize: '10px' }}>
            <Wallet
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.wallet.title')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.id')}
              </Typography>
              <Chip label={item.wallet.id} variant="square" color="green" />
            </Box>
          </Box>
        </Box>
      );
    }

    if (isPayment(item)) {
      return (
        <Box sx={containerSx}>
          <Typography sx={{ fontSize: '10px' }}>
            <CreditCard
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.payment.title')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.id')}
              </Typography>
              <Chip label={item.payment.id} variant="square" color="green" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.psp')}
              </Typography>
              <Chip label={item.payment.psp} variant="square" color="green" />
            </Box>
          </Box>
        </Box>
      );
    }
  };

  const Item = handleDestinationOrSource();

  if (!Item) return null;

  return Item;
};

export default SourceDestinationBox;
