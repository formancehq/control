import * as otlpApi from '@opentelemetry/api';
import { SpanStatusCode } from '@opentelemetry/api';

import { ObjectOf } from '@numaryhq/storybook';

import { Methods } from '~/src/utils/api';

export class Otel {
  activeOtlpContext: otlpApi.Context;
  carrier: ObjectOf<any>;
  span: otlpApi.Span;
  parsedUrl: URL;

  constructor(
    method: Methods,
    uri: string,
    name: string,
    body?: ObjectOf<any>
  ) {
    this.activeOtlpContext = otlpApi.context.active();
    this.carrier = {};
    otlpApi.propagation.inject(
      this.activeOtlpContext,
      this.carrier,
      otlpApi.defaultTextMapSetter
    );
    this.span = otlpApi.trace.getTracer(name).startSpan('http.request');
    // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/http.md
    this.parsedUrl = new URL(uri);
    this.initSpan(method, uri, body);
  }

  private initSpan(method: Methods, uri: string, body?: ObjectOf<any>) {
    this.span.setAttributes({
      'http.method': method,
      'http.url': uri,
      'net.peer.name': this.parsedUrl.host,
      'net.peer.port': this.parsedUrl.port,
    });
    if (body) {
      this.span.setAttributes({ 'http.body': JSON.stringify(body) });
    }
  }

  async handleResponse(response: Response): Promise<void> {
    this.span.setAttributes({
      'http.status': response.status,
    });
    if (response.status > 400) {
      this.span.setStatus({
        code: SpanStatusCode.ERROR,
        message: await response.text(),
      });
    }
  }
}
