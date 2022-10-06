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
import {
  Links,
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
import { redirect } from 'remix';

import styles from './root.css';
import { useOpen } from './src/hooks/useOpen';

import { LoadingButton, theme } from '@numaryhq/storybook';

import Layout from '~/src/components/Layout';
import { getRoute, OVERVIEW_ROUTE } from '~/src/components/Navbar/routes';
import ClientStyleContext from '~/src/contexts/clientStyleContext';
import { ServiceContext } from '~/src/contexts/service';
import { LedgerInfo } from '~/src/types/ledger';
import { logger } from '~/src/utils/api';
import { ReactApiClient } from '~/src/utils/api.client';
import { createApiClient, errorsMap } from '~/src/utils/api.server';
import {
  AUTH_CALLBACK_ROUTE,
  commitSession,
  COOKIE_NAME,
  decrypt,
  getJwtPayload,
  getOpenIdConfig,
  getSession,
  handleResponse,
  withSession,
} from '~/src/utils/auth.server';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const cookie = session.get(COOKIE_NAME);
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const openIdConfig = await getOpenIdConfig();
  if (openIdConfig) {
    if (!cookie) {
      if (!code) {
        // redirect to form
        return redirect(
          `${openIdConfig.authorization_endpoint}?client_id=${process.env.CLIENT_ID}&redirect_uri=${url.origin}${AUTH_CALLBACK_ROUTE}&response_type=code&scope=openid email offline_access`,
          {
            headers: {
              'Set-Cookie': await commitSession(session),
            },
          }
        );
      }
    } else {
      return handleResponse(
        await withSession(request, async () => {
          const decryptedCookie = decrypt(cookie);
          const api = await createApiClient(request, '');
          const currentUser = await api.getResource<LedgerInfo>(
            openIdConfig.userinfo_endpoint
          );
          if (decryptedCookie && currentUser) {
            const payload = getJwtPayload(decryptedCookie);

            return {
              currentUser: {
                ...currentUser,
                scp: payload ? payload.scp : [],
                jwt: decryptedCookie.access_token,
              },
            };
          }
        })
      );
    }
  }

  return {
    currentUser: {},
  };
};

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
  const { currentUser } = useLoaderData();
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
            api: new ReactApiClient(),
            currentUser,
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
