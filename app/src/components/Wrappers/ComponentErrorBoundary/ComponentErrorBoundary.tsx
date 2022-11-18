import React, { FunctionComponent } from 'react';

import { Box } from '@mui/material';
import { camelCase, get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ComponentErrorBoundaryProps } from './types';

import { EmptyState, LoadingButton, Page } from '@numaryhq/storybook';

import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import { Errors } from '~/src/types/generic';

const ComponentErrorBoundary: FunctionComponent<
  ComponentErrorBoundaryProps
> = ({ id, title: titlePage, error, showAction = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const key = get(error, 'message', 'error');

  const actionMap = {
    [Errors.NOT_FOUND]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.SERVICE_DOWN]: () => window.location.reload(),
    [Errors.ERROR]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.UNAUTHORIZED]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.FORBIDDEN]: () => navigate(getRoute(OVERVIEW_ROUTE)),
  };

  const action = get(actionMap, key, actionMap[Errors.ERROR]);
  const translation = get(actionMap, key) ? camelCase(key) : 'error';

  return (
    <Page id={id} title={titlePage ? t(titlePage) : undefined}>
      <Box mt={1}>
        <EmptyState
          title={t(`common.boundaries.errorState.${translation}.title`)}
          description={t(
            `common.boundaries.errorState.${translation}.description`
          )}
        >
          <>
            {showAction && (
              <Box mt={3}>
                <LoadingButton
                  id="error-boundary"
                  content={t(
                    `common.boundaries.errorState.${translation}.button`
                  )}
                  variant="primary"
                  onClick={() => action()}
                />
              </Box>
            )}
          </>
        </EmptyState>
      </Box>
    </Page>
  );
};

export default ComponentErrorBoundary;
