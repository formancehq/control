import React, { FunctionComponent } from 'react';

import { Send } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { RunSendProps } from './types';

import { Date } from '@numaryhq/storybook';

import ErrorBox from '~/src/components/Wrappers/Workflows/CustomNode/ErrorBox';
import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import SourceDestinationBox from '~/src/components/Wrappers/Workflows/CustomNode/SourceDestinationBox';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
  placeholderSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';

const RunSend: FunctionComponent<RunSendProps> = ({
  startedAt,
  terminatedAt,
  input,
  error,
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
      <NodeTitle label={t('pages.flow.send.title')} icon={<Send />} />
      <>
        <Box component="span" display="block" sx={containerSx} mt={1}>
          <Box sx={chipContainer()}>
            <Typography variant="bold">
              {t('pages.instance.sections.details.runSend.startedAt')}
            </Typography>
            {startedAt ? (
              <Date timestamp={startedAt} />
            ) : (
              <Typography variant="placeholder" sx={placeholderSx}>
                {getPlaceholder()}
              </Typography>
            )}
          </Box>
          <Box sx={chipContainer()}>
            <Typography variant="bold">
              {t('pages.instance.sections.details.runSend.startedAt')}
            </Typography>
            {terminatedAt ? (
              <Date timestamp={terminatedAt} />
            ) : (
              <Typography variant="placeholder" sx={placeholderSx}>
                {getPlaceholder()}
              </Typography>
            )}
          </Box>
          <SourceDestinationBox item={input.source} />
          <SourceDestinationBox item={input.destination} />
          <ErrorBox error={error} />
        </Box>
      </>
    </Box>
  );
};

export default RunSend;
