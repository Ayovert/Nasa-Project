FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN npm run client-install --omit=dev

COPY server/package*.json server/
RUN npm run server-install --omit=dev


COPY client/ client/
RUN npm run build-linux --prefix client

COPY server/ server/

USER node 


CMD ["npm", "start" , "--prefix", "server"]

EXPOSE 8000