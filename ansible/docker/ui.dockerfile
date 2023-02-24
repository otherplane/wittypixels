# ! Build Front-end
FROM node:lts-alpine

WORKDIR /app
COPY . ./

RUN npm install -g pnpm pm2
RUN pnpm install

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["pnpm run build:production && pm2 serve --spa /app/dist --no-daemon"]