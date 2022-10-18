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
API_URL=http://localhost/api
CLIENT_ID=control
CLIENT_SECRET=mysupersecret
# randomBytes(32)
ENCRYPTION_KEY=a18a6e9cbb589a5311aaa4c5adbd47d788bb9840ae355a234c0344687c595be4
# randomBytes(16)
ENCRYPTION_IV=5677f20d0ea3048a68b3781ee34089a9
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
API_URL=http://localhost/api CLIENT_ID=control CLIENT_SECRET=mysupersecret ENCRYPTION_KEY=mysuperencryptionkey ENCRYPTION_IV=6f0c77c78a624022 remix-serve build
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`