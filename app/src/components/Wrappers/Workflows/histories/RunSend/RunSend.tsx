import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { RunSendProps } from './types';

import { Date } from '@numaryhq/storybook';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import SourceDestinationBox from '~/src/components/Wrappers/Workflows/CustomNode/SourceDestinationBox';
import {
  chipContainer,
  containerSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';

const RunSend: FunctionComponent<RunSendProps> = ({
  name,
  startedAt,
  terminatedAt,
  terminated,
  input,
}) => {
  const { t } = useTranslation();

  return (
    <Box className=" react-flow__nodes">
      <Box className="react-flow__node-default">
        <NodeTitle label={name} />
        <>
          <Box component="span" display="block" pl={1} sx={containerSx}>
            <Box
              sx={{
                ...chipContainer,
                '& .MuiTypography-root': {
                  fontSize: '8px',
                },
              }}
            >
              <Typography variant="bold">
                {t('pages.instance.sections.details.runSend.startedAt')}
              </Typography>
              <Date timestamp={startedAt} />
            </Box>
            <Box sx={chipContainer}>
              <Typography variant="bold">
                {t('pages.instance.sections.details.runSend.startedAt')}
              </Typography>
              <Date timestamp={terminatedAt} />
            </Box>
            <SourceDestinationBox item={input.source} />
            <SourceDestinationBox item={input.destination} />
          </Box>
        </>
      </Box>
    </Box>
  );
};

export default RunSend;
