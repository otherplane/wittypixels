FROM node:14-alpine

WORKDIR /usr/src/app

COPY . ./

RUN pnpm install

EXPOSE 4000

RUN pnpm build

CMD [ "node", "dist/server.js" ]