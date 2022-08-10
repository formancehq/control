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
API_URL=http://localhost // this url works only with [Formance Local Stack](https://github.com/numary/stack)
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
yarn start
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`