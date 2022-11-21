import * as React from 'react';

import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import * as grpc from '@grpc/grpc-js';
import { ThemeProvider } from '@mui/material/styles';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/server-runtime';
import { RemixInstrumentation } from 'opentelemetry-instrumentation-remix';
import { renderToString } from 'react-dom/server';

import createEmotionCache from './src/utils/createEmotionCache';

import { theme } from '@numaryhq/storybook';

function configureTelemetry() {
  if (
    typeof process !== 'undefined' &&
    process.env.OTEL_TRACES &&
    process.env.OTEL_TRACES == '1'
  ) {
    let exporter: SpanExporter;
    if (process.env.DEBUG) {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
    }
    switch (process.env.OTEL_TRACES_EXPORTER) {
      case 'otlp':
        console.info(
          `Configure OTLP exporter with endpoint: ${process.env.OTEL_TRACES_EXPORTER_OTLP_ENDPOINT}`
        );
        exporter = new OTLPTraceExporter({
          url: process.env.OTEL_TRACES_EXPORTER_OTLP_ENDPOINT,
          concurrencyLimit: 10, // an optional limit on pending requests
          credentials: grpc.credentials.createInsecure(),
        });
        break;
      case 'zipkin':
        console.info(
          `Configure ZipKin exporter with endpoint: ${process.env.OTEL_TRACES_EXPORTER_ZIPKIN_ENDPOINT}`
        );
        exporter = new ZipkinExporter({
          url: process.env.OTEL_TRACES_EXPORTER_ZIPKIN_ENDPOINT,
          serviceName: 'control',
        });
        break;
      case 'console':
        exporter = new ConsoleSpanExporter();
        break;
      case undefined:
        return;
      case '':
        return;
      default:
        throw new Error(
          `Unexpected OpenTelemetry exporter type:
            ${process.env.OTEL_TRACES_EXPORTER}`
        );
    }

    const contextManager = new AsyncHooksContextManager();
    contextManager.enable();

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'control',
      })
    );

    const provider = new NodeTracerProvider({
      resource,
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register({
      propagator: new CompositePropagator({
        propagators: [
          new B3Propagator(),
          new B3Propagator({
            injectEncoding: B3InjectEncoding.MULTI_HEADER,
          }),
          new W3CTraceContextPropagator(),
        ],
      }),
      contextManager: contextManager,
    });
    console.info('Register instrumentations');
    registerInstrumentations({
      instrumentations: [
        new RemixInstrumentation({
          actionFormDataAttributes: {
            loader: true,
            action: true,
          },
        }),
        new HttpInstrumentation(),
      ],
      tracerProvider: provider,
    });
  }
}

// otel
configureTelemetry();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const MuiRemixServer = () => (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <RemixServer context={remixContext} url={request.url} />
      </ThemeProvider>
    </CacheProvider>
  );

  // Render the component to a string.
  const html = renderToString(<MuiRemixServer />);

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html);

  let stylesHTML = '';

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`;
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
    stylesHTML = `${stylesHTML}${newStyleTag}`;
  });

  // Add the Emotion style tags after the insertion point meta tag
  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
