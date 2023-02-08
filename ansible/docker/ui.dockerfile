# ! Build Front-end
FROM node:18-alpine as build

WORKDIR /app
COPY . ./

RUN npm install -g pnpm
RUN pnpm install --prod
RUN pnpm run build:production


# ! Create Static SPA Container
FROM node:18-alpine as prod

# ? Copy files from previous stage
COPY --from=build /app/dist /app

# ? Install PM2
RUN npm install -g pm2

ENV HOST=0.0.0.0
ENV PORT=8080

CMD [ "pm2", "serve", "--spa", "/app", "--no-daemon" ]