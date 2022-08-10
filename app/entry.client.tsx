import * as React from 'react';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@numaryhq/storybook';
import ClientStyleContext from '~/src/contexts/clientStyleContext';
import createEmotionCache from '~/src/utils/createEmotionCache';
import { RemixBrowser } from '@remix-run/react';
import i18n from './src/translations';
import { I18nextProvider } from 'react-i18next';
import { hydrateRoot } from 'react-dom/client';
import { GlobalStyles } from '@mui/material';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrateRoot(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document,
  <ClientCacheProvider>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: '#f5f5f5',
              margin: 0,
              padding: 0,
            },
          }}
        />
        <RemixBrowser />
      </I18nextProvider>
    </ThemeProvider>
  </ClientCacheProvider>
);
