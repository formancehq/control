import React, { FunctionComponent } from 'react';
import { EmptyState, LoadingButton, Page } from '@numaryhq/storybook';
import { ComponentErrorBoundaryProps } from './types';
import { Support } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Errors } from '~/src/types/generic';
import { get, noop } from 'lodash';
import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import { useNavigate } from 'react-router-dom';

const ComponentErrorBoundary: FunctionComponent<
  ComponentErrorBoundaryProps
> = ({ id, title: titlePage, error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const def = 'default';
  const err = get(error, 'message', def);

  const actionMap = {
    [Errors.NOT_FOUND]: () =>
      window.open('https://discord.com/invite/xyHvcbzk4w'),
    [Errors.MS_DOWN]: () => null,
    [def]: () => navigate(getRoute(OVERVIEW_ROUTE)),
  };

  return (
    <Page id={id} title={t(titlePage)}>
      <EmptyState
        title={t(`common.boundaries.errorState.${err}.title`)}
        description={`${t(
          `common.boundaries.errorState.${err}.description`
        )} 👇`}
      >
        <Box mt={3}>
          <LoadingButton
            content={t(`common.boundaries.errorState.${err}.button`)}
            variant="primary"
            endIcon={<Support />}
            onClick={() => get(actionMap, err, noop)()}
          />
        </Box>
      </EmptyState>
    </Page>
  );
};

export default ComponentErrorBoundary;
