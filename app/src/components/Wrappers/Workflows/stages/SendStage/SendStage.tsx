import React, { FunctionComponent } from 'react';

import { Send } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SendStageProps } from './types';

import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import SourceDestinationBox from '~/src/components/Wrappers/Workflows/CustomNode/SourceDestinationBox';

const SendStage: FunctionComponent<SendStageProps> = ({ send }) => {
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
        <Box
          component="span"
          sx={{
            textAlign: 'initial',
            display: 'block',
            fontSize: 10,
            color: ({ palette }) => palette.neutral[300],
            mt: 1,
          }}
        >
          {t('pages.flow.send.destination')}
        </Box>
        <SourceDestinationBox item={send.destination} />
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
          {t('pages.flow.send.source')}
        </Box>
        <SourceDestinationBox item={send.source} />
      </>
    </Box>
  );
};

export default SendStage;
