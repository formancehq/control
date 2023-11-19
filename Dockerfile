FROM node:18 as deps
WORKDIR /app
COPY ./package.json ./
RUN yarn install

FROM node:18 as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN yarn run build

FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
ADD . .
CMD ["yarn", "run", "start"]

FROM node:18-slim as app
WORKDIR /app
ENV NODE_ENV=production
ARG VERSION
ENV VERSION=${VERSION}
ADD . .
ENV DEBUG=1
CMD ["yarn", "run", "start"]
