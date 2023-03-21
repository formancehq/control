import React, { FunctionComponent } from 'react';

import { AccountTree, CreditCard, Wallet } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SendStageProps } from './types';

import { Chip } from '@numaryhq/storybook';

import {
  chipContainer,
  containerSx,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';

const SendStage: FunctionComponent<SendStageProps> = ({ send }) => {
  const { t } = useTranslation();

  const handleDestinationOrSource = (item: any) => {
    if (item.account) {
      return (
        <Box pl={2} sx={containerSx}>
          <Typography sx={{ fontSize: '10px' }}>
            <AccountTree
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            {t('pages.workflow.sections.details.config.send.account')}
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.workflow.sections.details.config.send.id')}
              </Typography>
              <Chip label={item.account.id} variant="square" color="green" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.workflow.sections.details.config.send.ledger')}
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

    if (item.wallet) {
      return (
        <Box pl={2} sx={containerSx}>
          <Typography sx={{ fontSize: '10px' }}>
            <Wallet
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            Wallet
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.workflow.sections.details.config.send.id')}
              </Typography>
              <Chip label={item.wallet.id} variant="square" color="green" />
            </Box>
          </Box>
        </Box>
      );
    }

    if (item.payment) {
      return (
        <Box pl={2} sx={containerSx}>
          <Typography sx={{ fontSize: '10px' }}>
            <CreditCard
              fontSize="small"
              sx={{ width: '0.5em', height: '0.5em', pr: 0.5 }}
            />
            Payment
          </Typography>
          <Box component="span" display="block" pl={1}>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.workflow.sections.details.config.send.id')}
              </Typography>
              <Chip label={item.payment.id} variant="square" color="green" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.workflow.sections.details.config.send.psp')}
              </Typography>
              <Chip label={item.payment.psp} variant="square" color="green" />
            </Box>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box className=" react-flow__nodes">
      <Box className="react-flow__node-default">
        <p>{t('pages.workflow.sections.details.config.send.title')}</p>
        <>
          <Box
            component="span"
            sx={{
              textAlign: 'initial',
              display: 'block',
              fontSize: 10,
              color: ({ palette }) => palette.neutral[300],
            }}
          >
            {t('pages.workflow.sections.details.config.send.destination')}
          </Box>
          {handleDestinationOrSource(send.destination)}
        </>
        <>
          <Box
            component="span"
            sx={{
              textAlign: 'initial',
              display: 'block',
              fontSize: 10,
              color: ({ palette }) => palette.neutral[300],
            }}
          >
            {t('pages.workflow.sections.details.config.send.source')}
          </Box>
          {handleDestinationOrSource(send.source)}
        </>
      </Box>
    </Box>
  );
};

export default SendStage;
