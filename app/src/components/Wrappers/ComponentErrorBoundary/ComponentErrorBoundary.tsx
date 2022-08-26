import React, { FunctionComponent } from 'react';
import { EmptyState, LoadingButton, Page } from '@numaryhq/storybook';
import { ComponentErrorBoundaryProps } from './types';
import { Support } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Errors } from '~/src/types/generic';
import { camelCase, get } from 'lodash';
import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import { useNavigate } from 'react-router-dom';

const ComponentErrorBoundary: FunctionComponent<
  ComponentErrorBoundaryProps
> = ({ id, title: titlePage, error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const key = camelCase(get(error, 'message', 'error'));

  const actionMap = {
    [Errors.NOT_FOUND]: () =>
      window.open('https://discord.com/invite/xyHvcbzk4w'),
    [Errors.SERVICE_DOWN]: () => null,
    [Errors.ERROR]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.UNAUTHORIZED]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.FORBIDDEN]: () => navigate(getRoute(OVERVIEW_ROUTE)),
  };

  const action = get(actionMap, key, actionMap[Errors.ERROR]);

  return (
    <Page id={id} title={t(titlePage)}>
      <EmptyState
        title={t(`common.boundaries.errorState.${key}.title`)}
        description={`${t(
          `common.boundaries.errorState.${key}.description`
        )} 👇`}
      >
        <Box mt={3}>
          <LoadingButton
            content={t(`common.boundaries.errorState.${key}.button`)}
            variant="primary"
            endIcon={<Support />}
            onClick={() => action()}
          />
        </Box>
      </EmptyState>
    </Page>
  );
};

export default ComponentErrorBoundary;
