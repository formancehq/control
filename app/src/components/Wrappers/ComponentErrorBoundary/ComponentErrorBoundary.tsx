import React, { FunctionComponent } from 'react';
import { EmptyState, LoadingButton, Page } from '@numaryhq/storybook';
import { ComponentErrorBoundaryProps } from './types';
import { Support } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Errors } from '~/src/types/generic';
import { camal, get } from 'radash';
import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import { useNavigate } from 'react-router-dom';

const ComponentErrorBoundary: FunctionComponent<
  ComponentErrorBoundaryProps
> = ({ id, title: titlePage, error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const key = camal(get(error, (error) => error.message, 'error'));

  const actionMap = {
    [Errors.NOT_FOUND]: () =>
      window.open('https://discord.com/invite/xyHvcbzk4w'),
    [Errors.SERVICE_DOWN]: () => null,
    [Errors.ERROR]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.UNAUTHORIZED]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.FORBIDDEN]: () => navigate(getRoute(OVERVIEW_ROUTE)),
  };

  const action = get(actionMap, key, actionMap[Errors.ERROR]);
  const translation = get(actionMap, key) ? key : 'error';

  return (
    <Page id={id} title={t(titlePage)}>
      <Box mt={1}>
        <EmptyState
          title={t(`common.boundaries.errorState.${translation}.title`)}
          description={`${t(
            `common.boundaries.errorState.${translation}.description`
          )} 👇`}
        >
          <Box mt={3}>
            <LoadingButton
              id="error-boundary"
              content={t(`common.boundaries.errorState.${translation}.button`)}
              variant="primary"
              endIcon={<Support />}
              onClick={() => action()}
            />
          </Box>
        </EmptyState>
      </Box>
    </Page>
  );
};

export default ComponentErrorBoundary;
