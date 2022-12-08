# Control OSS

## Stack

- [Remix Docs](https://remix.run/docs)
- [Formance Local Stack](https://github.com/formancehq/stack)

## Development

From your terminal:

```sh
touch .env
```

```
// works with [Formance Local Stack](https://github.com/formancehq/stack)
API_URL=http://localhost/api
CLIENT_ID=control
CLIENT_SECRET=mysupersecret
ENCRYPTION_KEY=mysuperencryptionkey
# randomBytes(8)
ENCRYPTION_IV=6f0c77c78a624022
REDIRECT_URI=http://localhost:3000
# change to 1 to activate opentelemetry
OTEL_TRACES=0
OTEL_TRACES_EXPORTER=zipkin
OTEL_TRACES_EXPORTER_ZIPKIN_ENDPOINT=http://localhost:9411/api/v2/spans
UNSECURE_COOKIES=1
```

```sh
yarn dev
```

This starts your app in development mode, rebuilding assets on file changes.

If you need to run open-tel use `docker compose up` and change OTEL_TRACES to 1.

## Deployment

```sh
yarn build
```

Then run the app in production mode:

```sh
# /!\ .env is not sourced by remix
API_URL=http://localhost/api CLIENT_ID=control CLIENT_SECRET=mysupersecret ENCRYPTION_KEY=mysuperencryptionkey ENCRYPTION_IV=6f0c77c78a624022 REDIRECT_URI=http://localhost:3000 UNSECURE_COOKIES=0 OTEL_TRACES=1 OTEL_TRACES_EXPORTER=zipkin OTEL_TRACES_EXPORTER_ZIPKIN_ENDPOINT=http://localhost:9411/api/v2/spans remix-serve build
```
