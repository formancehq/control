import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DelayStageProps } from './types';

import { Chip } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Workflows/CustomNode/NodeTitle';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
} from '~/src/components/Workflows/stages/utils';
import { orchestrationStagesIconMap } from '~/src/components/Wrappers/StatusChip/maps';
import { OrchestrationStages } from '~/src/types/orchestration';

const DelayStage: FunctionComponent<DelayStageProps> = ({ delay }) => {
  const { t } = useTranslation();

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.delay.title')}
        icon={orchestrationStagesIconMap[OrchestrationStages.DELAY]}
      />
      <>
        <Box component="span" display="block" mt={1} sx={containerSx}>
          <Box sx={chipContainer(delay.duration)}>
            <Typography sx={{ fontSize: '8px' }} variant="bold">
              {t('pages.flow.delay.duration')}
            </Typography>
            <Chip
              label={getPlaceholder(delay.duration)}
              variant="square"
              color="brown"
            />
          </Box>
          <Box sx={chipContainer(delay.until)}>
            <Typography sx={{ fontSize: '8px' }} variant="bold">
              {t('pages.flow.delay.until')}
            </Typography>
            <Chip
              label={getPlaceholder(delay.until)}
              variant="square"
              color="brown"
            />
          </Box>
        </Box>
      </>
    </Box>
  );
};

export default DelayStage;
