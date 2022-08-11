FROM node:16-alpine
WORKDIR /app

COPY ./package.json ./
RUN yarn install
COPY ./ .
RUN yarn run build
ENV NODE_ENV=production
CMD ["yarn", "run", "remix-serve", "build"]
