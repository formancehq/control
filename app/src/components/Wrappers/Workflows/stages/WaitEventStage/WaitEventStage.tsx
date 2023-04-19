import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { WaitEventStageProps } from './types';

import { Chip } from '@numaryhq/storybook';

import { orchestrationStagesIconMap } from '~/src/components/Wrappers/StatusChip/maps';
import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { OrchestrationStages } from '~/src/types/orchestration';

const WaitEventStage: FunctionComponent<WaitEventStageProps> = ({
  wait_event,
}) => {
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
        label={t('pages.flow.waitEvent.title')}
        icon={orchestrationStagesIconMap[OrchestrationStages.WAIT_EVENT]}
      />
      <>
        <Box component="span" display="block" mt={1} sx={containerSx}>
          <Box sx={chipContainer(wait_event.event)}>
            <Typography sx={{ fontSize: '8px' }} variant="bold">
              {t('pages.flow.waitEvent.event')}
            </Typography>
            <Chip
              label={getPlaceholder(wait_event.event)}
              variant="square"
              color="blue"
            />
          </Box>
        </Box>
      </>
    </Box>
  );
};

export default WaitEventStage;
