import React, { FunctionComponent } from 'react';

import { ArrowRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LoadingButton } from '@numaryhq/storybook';

import { getRoute } from '~/src/components/Layout/routes';
import { ShowListActionProps } from '~/src/components/Wrappers/Lists/Actions/ShowListAction/types';

const ShowListAction: FunctionComponent<ShowListActionProps> = ({
  route,
  id,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <Box key={id} component="span">
      <LoadingButton
        id={`show-${id}`}
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            navigate(getRoute(route, id));
          }
        }}
        endIcon={<ArrowRight />}
      />
    </Box>
  );
};

export default ShowListAction;
