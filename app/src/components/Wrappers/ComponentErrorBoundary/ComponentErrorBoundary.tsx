import React, { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';
import { camelCase, get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ComponentErrorBoundaryProps } from './types';

import { EmptyState, LoadingButton } from '@numaryhq/storybook';

import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Layout/routes';
import { Errors } from '~/src/types/generic';

const ComponentErrorBoundary: FunctionComponent<
  ComponentErrorBoundaryProps
> = ({ error, showAction = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const key = get(error, 'message', 'error');

  const actionMap = {
    [Errors.NOT_FOUND]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.SERVICE_DOWN]: () => window.location.reload(),
    [Errors.ERROR]: () => window.location.reload(),
    [Errors.UNAUTHORIZED]: () => navigate(getRoute(OVERVIEW_ROUTE)),
    [Errors.FORBIDDEN]: () => navigate(getRoute(OVERVIEW_ROUTE)),
  };

  const action = get(actionMap, key, actionMap[Errors.ERROR]);
  const translation = get(actionMap, key) ? camelCase(key) : 'error';

  return (
    <Box mt={1}>
      <EmptyState title={t('common.boundaries.title')}>
        <>
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              color: ({ palette }) => palette.neutral[0],
              backgroundColor: ({ palette }) => palette.neutral[900],
            }}
          >
            <Typography variant="body2">
              {t(`common.boundaries.errorState.${translation}.description`)}
            </Typography>
          </Box>
          {showAction && (
            <Box mt={3}>
              <LoadingButton
                id="error-boundary"
                content={t(
                  `common.boundaries.errorState.${translation}.button`
                )}
                variant="stroke"
                onClick={() => action()}
              />
            </Box>
          )}
        </>
      </EmptyState>
    </Box>
  );
};

export default ComponentErrorBoundary;
