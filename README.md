# Control OSS

## Stack

- [Remix Docs](https://remix.run/docs)
- [Formance Local Stack](https://github.com/numary/stack)

## Development

From your terminal:

```sh
touch .env
```

```
// works with [Formance Local Stack](https://github.com/numary/stack)
API_URL_BACK=http://localhost
API_URL_FRONT=http://localhost
```

```sh
yarn dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

```sh
yarn build
```

Then run the app in production mode:

```sh
// .env is not sourced by remix
API_URL_BACK=http://localhost API_URL_FRONT=http://localhost remix-serve build
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`