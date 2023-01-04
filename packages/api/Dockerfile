FROM node:14-alpine

WORKDIR /usr/src/app

COPY . ./

RUN yarn

EXPOSE 3000

RUN yarn build

CMD [ "node", "dist/server.js" ]