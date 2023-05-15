import * as React from 'react';
import { ReactElement, useEffect, useState } from 'react';

import { withEmotionCache } from '@emotion/react';
import { Forum, Logout } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material';
import { redirect } from '@remix-run/node';
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
import { camelCase, get, head, noop } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import reactFlowStyles from 'reactflow/dist/style.css';

import styles from './root.css';
import { useOpen } from './src/hooks/useOpen';

import { LoadingButton, Snackbar, theme } from '@numaryhq/storybook';

import Layout from '~/src/components/Layout';
import {
  getRoute,
  OVERVIEW_ROUTE,
  STACK_CREATE_ROUTE,
} from '~/src/components/Layout/routes';
import ClientStyleContext from '~/src/contexts/clientStyleContext';
import { ServiceContext } from '~/src/contexts/service';
import { Errors } from '~/src/types/generic';
import { AuthCookie, CurrentUser, errorsMap, logger } from '~/src/utils/api';
import { ReactApiClient } from '~/src/utils/api.client';
import {
  AUTH_CALLBACK_ROUTE,
  COOKIE_NAME,
  decrypt,
  getJwtPayload,
  getMembershipOpenIdConfig,
  getSession,
  handleResponse,
  REDIRECT_URI,
  State,
  withSession,
} from '~/src/utils/auth.server';
import { getFavorites } from '~/src/utils/membership';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: reactFlowStyles },
  { rel: 'stylesheet', href: styles },
];

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const cookie = session.get(COOKIE_NAME);
  const url = new URL(request.url);
  const stateObject: State = { redirectTo: `${url.pathname}${url.search}` };
  const buff = new Buffer(JSON.stringify(stateObject));
  const stateAsBase64 = buff.toString('base64');
  const openIdConfig = await getMembershipOpenIdConfig();
  const error = url.searchParams.get('error');

  if (error) {
    throw Error(
      JSON.stringify({
        error,
        description: url.searchParams.get('error_description'),
        error_type: Errors.AUTH,
      })
    );
  }

  if (!cookie && !error) {
    // TODO add method on auth.server with URL params to be more elegant
    return redirect(
      `${openIdConfig.authorization_endpoint}?client_id=${process.env.MEMBERSHIP_CLIENT_ID}&redirect_uri=${REDIRECT_URI}${AUTH_CALLBACK_ROUTE}&state=${stateAsBase64}&response_type=code&scope=openid email offline_access supertoken`
    );
  }

  return handleResponse(
    await withSession(request, async () => {
      const sessionHolder = decrypt<AuthCookie>(cookie);
      const payload = getJwtPayload(sessionHolder);
      const featuresDisabled = get(process, 'env.FEATURES_DISABLED', '').split(
        ','
      );
      const pseudo =
        sessionHolder.currentUser && sessionHolder.currentUser.email
          ? sessionHolder.currentUser.email.split('@')[0]
          : undefined;

      const currentUser: CurrentUser = {
        ...sessionHolder.currentUser,
        avatarLetter: pseudo ? pseudo.split('')[0].toUpperCase() : undefined,
        scp: payload && payload.scp ? payload.scp : [],
        pseudo,
      };
      console.log('>>>>>curr', currentUser);

      return {
        featuresDisabled,
        abilities: {
          shouldRedirectToStackOnboarding:
            currentUser.totalStack === 0 || false,
        },
        metas: {
          origin: REDIRECT_URI,
          openIdConfig,
          api: get(getFavorites(sessionHolder.currentUser), 'stackUrl'),
          membership: process.env.MEMBERSHIP_URL,
        },
        currentUser,
      };
    })
  );
};

const renderError = (
  navigate: NavigateFunction,
  t: any,
  message?: string,
  description?: string,
  type?: Errors
): ReactElement => {
  const isAuthError = (type && type == Errors.AUTH) || false;

  return (
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
          <Typography variant="large2x" mb={0}>
            {t('common.boundaries.title', {
              type: isAuthError
                ? t(`common.boundaries.${Errors.AUTH}`)
                : undefined,
            })}
          </Typography>
          <Typography variant="h2" mt={1}>
            {message || t('common.boundaries.errorState.error.title')}
          </Typography>
          <Box
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 2,
              color: ({ palette }) => palette.neutral[0],
              backgroundColor: ({ palette }) => palette.neutral[900],
            }}
          >
            <Typography variant="body2">
              {description ||
                t('common.boundaries.errorState.error.description')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isAuthError && (
              <LoadingButton
                id="go-back-home"
                content={t('common.boundaries.buttons.overview')}
                variant="stroke"
                onClick={() => navigate(getRoute(OVERVIEW_ROUTE))}
                sx={{ mt: 5 }}
              />
            )}
            {!isAuthError && (
              <LoadingButton
                id="logout"
                content={t('topbar.logout')}
                variant="stroke"
                startIcon={<Logout />}
                onClick={() => {
                  window.location.href = `${window.origin}/auth/redirect-logout`;
                }}
                sx={{ mt: 5 }}
              />
            )}
            <LoadingButton
              id="get-help"
              content={t('common.boundaries.buttons.getHelp')}
              variant="stroke"
              startIcon={<Forum />}
              onClick={() => {
                window.open(
                  'https://formance-community.slack.com/ssb/redirect',
                  '_blank'
                );
              }}
              sx={{ mt: 5 }}
            />
          </Box>
        </Box>
      </Box>
    </Backdrop>
  );
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
          <LiveReload />
          <Scripts />
        </body>
      </html>
    );
  }
);

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { metas, currentUser, featuresDisabled, abilities } =
    useLoaderData<ServiceContext>() as ServiceContext;
  const { t } = useTranslation();
  const [loading, _load, stopLoading] = useOpen(true);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    active: false,
    message: t('common.feedback.error'),
  });

  const displayFeedback = (message = 'common.feedback.error') => {
    setFeedback({ active: true, message: t(message) });
  };
  const [service, setService] = useState<
    Omit<ServiceContext, 'setService' | 'api'>
  >({
    featuresDisabled,
    currentUser,
    metas,
    abilities,
    snackbar: displayFeedback,
  });

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setFeedback({ ...feedback, active: false });
  };

  useEffect(() => {
    if (abilities && abilities.shouldRedirectToStackOnboarding) {
      navigate(STACK_CREATE_ROUTE);
    }
    stopLoading();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!global.timer) {
      const refreshToken = (): Promise<any> =>
        fetch(`${metas.origin}/auth/refresh`)
          .then((response) => response.json())
          .then(({ interval }: { interval: number }) =>
            setTimeout(refreshToken, interval)
          )
          .catch(async (reason) => {
            console.info('Error when handling session. Ending session', reason);
            window.location.href = `${origin}/auth/redirect-logout`;
          });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      global.timer = refreshToken();
    }
  }, []);

  return (
    <Document>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
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
            ...service,
            api: new ReactApiClient(),
            setService,
          }}
        >
          <Layout>
            <Outlet />
            <Snackbar
              open={feedback.active}
              onClose={handleClose}
              message={feedback.message}
            />
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
  let errorParsed = {
    error: undefined,
    description: undefined,
    error_type: undefined,
  };
  try {
    errorParsed = JSON.parse(error.message);
  } catch {
    noop();
  }

  return (
    <Document title="Error!">
      <Layout>
        {renderError(
          navigate,
          t,
          errorParsed.error,
          errorParsed.description,
          errorParsed.error_type
        )}
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  logger(caught, 'app/root/CatchBoundary');

  const error = camelCase(get(errorsMap, caught.status, errorsMap[422]));
  const message = t(`common.boundaries.errorState.${error}.title`);
  const description = t(`common.boundaries.errorState.${error}.description`);

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      {renderError(navigate, t, message, description)}
    </Document>
  );
}
