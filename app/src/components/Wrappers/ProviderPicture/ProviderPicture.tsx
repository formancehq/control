import React, { FunctionComponent } from 'react';
import { get } from 'lodash';
import { Box, Typography } from '@mui/material';
import { providersMap } from '~/src/utils/providersMap';
import { ProviderPictureProps } from './types';

const ProviderPicture: FunctionComponent<ProviderPictureProps> = ({
  provider,
}) => {
  // TODO when provider will be an Enum and not a string radash should work
  const logoAttr = get(providersMap, provider.toLowerCase());

  return (
    <Box
      component="span"
      display="flex"
      alignItems="center"
      sx={{
        '& img': {
          marginRight: 1,
          width: logoAttr ? logoAttr.width : 'initial',
        },
      }}
    >
      {logoAttr && <img src={logoAttr.path} alt={provider} />}
      <Typography sx={{ textTransform: 'capitalize' }}>{provider}</Typography>
    </Box>
  );
};

export default ProviderPicture;
