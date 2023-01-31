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
// from ci
VERSION=develop
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

API_URL=https://ucjvbpqlmbqx-xgwo.staging.formance.cloud/api CLIENT_ID=85480381-ade8-4b76-bf2c-b4104d2cf6d1 CLIENT_SECRET=1080f8b5-6404-40b4-a1d0-bda283e1080f REDIRECT_URI=http://localhost:3000 ENCRYPTION_KEY=mysuperencryptionkey ENCRYPTION_IV=6f0c77c78a624022 UNSECURE_COOKIES=0 yarn remix dev

API_URL=https://qqaoixccdziy-wxkc.sandbox.formance.cloud/api CLIENT_ID=4b081559-9466-473c-8c17-e218a6ac4310 CLIENT_SECRET=0163f9d2-fbf6-4e7b-8cb1-227a5d5b68a2 REDIRECT_URI=http://localhost:3000 ENCRYPTION_KEY=mysuperencryptionkey ENCRYPTION_IV=6f0c77c78a624022 UNSECURE_COOKIES=0 yarn remix dev