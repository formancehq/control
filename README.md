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
API_URL=http://localhost
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
// from ci
VERSION=develop
FEATURES_DISABLED="workflows,instances,payments" // See Feature Flag section
```

```sh
yarn dev
```

This starts your app in development mode, rebuilding assets on file changes.

If you need to run open-tel use `docker compose up` and change OTEL_TRACES to 1.


## Feature flag
Features can be disabled by setting one or more of the feature string into FEATURES_DISABLED env var. String must be separated by a comma.

List can be found inside `app/src/service.ts` (`enum FEATURES`)

Note that if FEATURES_DISABLED is not given, all features will be enabled.

## Deployment

```sh
yarn build
```

Then run the app in production mode:

```sh
# /!\ .env is not sourced by remix
API_URL=http://localhost CLIENT_ID=control CLIENT_SECRET=mysupersecret ENCRYPTION_KEY=mysuperencryptionkey ENCRYPTION_IV=6f0c77c78a624022 REDIRECT_URI=http://localhost:3000 UNSECURE_COOKIES=0 OTEL_TRACES=1 OTEL_TRACES_EXPORTER=zipkin OTEL_TRACES_EXPORTER_ZIPKIN_ENDPOINT=http://localhost:9411/api/v2/spans remix-serve build
```