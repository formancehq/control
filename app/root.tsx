import * as React from 'react';
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';
import { withEmotionCache } from '@emotion/react';
import {
  Typography,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material';
import { Page, theme } from '@numaryhq/storybook';
import ClientStyleContext from '~/src/contexts/clientStyleContext';
import Layout from '~/src/components/Layout';
import { useLoaderData } from '@remix-run/react';
import { ApiClient } from '~/src/utils/api';
import { ServiceContext } from '~/src/contexts/service';
import styles from './root.css';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export async function loader() {
  return json({
    ENV: {
      API_URL_FRONT: process.env.API_URL_FRONT,
      API_URL_BACK: process.env.API_URL_BACK, // just in case of need
    },
  });
}

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
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
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

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { ENV } = useLoaderData();

  return (
    <Document>
      <ServiceContext.Provider
        value={{
          api: new ApiClient(ENV.API_URL_FRONT),
        }}
      >
        <Layout>
          <Outlet />
        </Layout>
      </ServiceContext.Provider>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Error!">
      <Layout>
        <Page title="There was an error" id="error-boundary">
          <Typography>{error.message}</Typography>
        </Page>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <Page title="There was an error" id="catch-boundary">
          <>
            <Typography variant="h1">
              {caught.status}: {caught.statusText}
            </Typography>
            <Typography>{message}</Typography>
          </>
        </Page>
      </Layout>
    </Document>
  );
}
