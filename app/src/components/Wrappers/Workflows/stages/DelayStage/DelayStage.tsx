import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DelayStageProps } from './types';

import { Chip } from '@numaryhq/storybook';

import {
  chipContainer,
  containerSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';

const DelayStage: FunctionComponent<DelayStageProps> = ({ delay }) => {
  const { t } = useTranslation();

  return (
    <Box className=" react-flow__nodes">
      <Box className="react-flow__node-default">
        <p>{t('pages.workflow.sections.details.config.delay.title')}</p>
        <>
          <Box component="span" display="block" pl={1} sx={containerSx}>
            <Box sx={chipContainer}>
              <Typography sx={{ fontSize: '8px' }} variant="bold">
                {t('pages.workflow.sections.details.config.delay.duration')}
              </Typography>
              <Chip label={delay.duration} variant="square" color="brown" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={{ fontSize: '8px' }} variant="bold">
                {t('pages.workflow.sections.details.config.delay.until')}
              </Typography>
              <Chip label={delay.until} variant="square" color="brown" />
            </Box>
          </Box>
        </>
      </Box>
    </Box>
  );
};

export default DelayStage;
