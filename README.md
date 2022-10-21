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
OPENTEL_COLLECTOR=http://localhost:4318/v1/traces
```

```sh
yarn dev
```

This starts your app in development mode, rebuilding assets on file changes.

If you need to run open-tel use `docker compose up`

## Deployment

```sh
yarn build
```

Then run the app in production mode:

```sh
// .env is not sourced by remix
API_URL=http://localhost/api CLIENT_ID=control CLIENT_SECRET=mysupersecret ENCRYPTION_KEY=mysuperencryptionkey ENCRYPTION_IV=6f0c77c78a624022 remix-serve build
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`