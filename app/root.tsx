import * as React from 'react';
import { ReactElement } from 'react';

import { withEmotionCache } from '@emotion/react';
import { Home } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  NavigateFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from '@remix-run/react';
import { LinksFunction, LoaderFunction } from '@remix-run/server-runtime';
import { camelCase, get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './root.css';
import { useOpen } from './src/hooks/useOpen';

import { LoadingButton, theme } from '@numaryhq/storybook';

import Layout from '~/src/components/Layout';
import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import ClientStyleContext from '~/src/contexts/clientStyleContext';
import { ServiceContext } from '~/src/contexts/service';
import { ApiClient, errorsMap, logger } from '~/src/utils/api';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader: LoaderFunction = async () =>
  json({
    ENV: {
      API_URL_FRONT: process.env.API_URL_FRONT,
      API_URL_BACK: process.env.API_URL_BACK, // just in case of need
    },
  });

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);
    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <title>{title || 'Formance'}</title>
          <Meta />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Inter:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,500,700&display=swap"
          />
          <Links />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

const renderError = (
  navigate: NavigateFunction,
  t: any,
  message?: string,
  description?: string
): ReactElement => (
  <Backdrop
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
    open={true}
  >
    <Box
      display="flex"
      justifyContent="space-evenly"
      sx={{
        width: '100%',
        height: '100%',
        background: ({ palette }) => palette.neutral[0],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          alignSelf: 'center',
          background: ({ palette }) => palette.neutral[0],
        }}
      >
        <Typography variant="large3x" mb={3}>
          {t('common.boundaries.title')}
        </Typography>
        <Typography variant="h2" mt={3}>
          {message || t('common.boundaries.errorState.error.title')}
        </Typography>
        <Typography variant="body2" mt={3}>
          {description || t('common.boundaries.errorState.error.description')}
        </Typography>
        <LoadingButton
          id="go-back-home"
          content="Go back home"
          variant="primary"
          startIcon={<Home />}
          onClick={() => navigate(getRoute(OVERVIEW_ROUTE))}
          sx={{ mt: 5 }}
        />
      </Box>
    </Box>
  </Backdrop>
);

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { ENV } = useLoaderData();
  const [loading, _load, stopLoading] = useOpen(true);

  React.useEffect(() => {
    stopLoading();
  });

  return (
    <Document>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            background: theme.palette.neutral[0],
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <ServiceContext.Provider
          value={{
            api: new ApiClient(ENV.API_URL_FRONT),
          }}
        >
          <Layout>
            <Outlet />
          </Layout>
        </ServiceContext.Provider>
      )}
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  logger(error, 'app/root', undefined);

  return (
    <Document title="Error!">
      <Layout>{renderError(navigate, t)}</Layout>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const error = camelCase(get(errorsMap, caught.status, errorsMap[422]));
  const message = t(`common.boundaries.errorState.${error}.title`);
  const description = t(`common.boundaries.errorState.${error}.description`);

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>{renderError(navigate, t, message, description)}</Layout>
    </Document>
  );
}
