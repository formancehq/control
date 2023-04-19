import React, { FunctionComponent } from 'react';

import { AccountTree, CreditCard, Wallet } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SourceDestinationBoxProps } from './types';

import { Chip } from '@numaryhq/storybook';

import {
  getLedgerAccountDetailsRoute,
  getRoute,
  LEDGER_ROUTE,
  PAYMENT_ROUTE,
  WALLET_ROUTE,
} from '~/src/components/Layout/routes';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
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
  const titleTypoSx = {
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
  };

  const handleDestinationOrSource = () => {
    if (isAccount(item)) {
      return (
        <Box sx={containerSx}>
          <Typography sx={titleTypoSx}>
            <AccountTree
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.flow.send.account')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer(item.account.id)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.id')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(item.account.id)}
                color="green"
                route={getLedgerAccountDetailsRoute(
                  item.account.id,
                  item.account.ledger
                )}
              />
            </Box>
            <Box sx={chipContainer(item.account.ledger)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.ledger')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(item.account.ledger)}
                route={getRoute(LEDGER_ROUTE, item.account.ledger)}
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
          <Typography sx={titleTypoSx}>
            <Wallet
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.wallet.title')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer(item.wallet.id)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.id')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(item.wallet.id)}
                route={getRoute(WALLET_ROUTE, item.wallet.id)}
                color="green"
              />
            </Box>
          </Box>
        </Box>
      );
    }

    if (isPayment(item)) {
      return (
        <Box sx={containerSx}>
          <Typography sx={titleTypoSx}>
            <CreditCard
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.payment.title')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer(item.payment.id)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.id')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(item.payment.id)}
                color="green"
                route={getRoute(PAYMENT_ROUTE, item.payment.id)}
              />
            </Box>
            <Box sx={chipContainer(item.payment.psp)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.send.psp')}
              </Typography>
              <Chip
                label={getPlaceholder(item.payment.psp)}
                variant="square"
                color="green"
              />
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
