FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${SMTP_PORT}
CMD [ "node", "server.js" ]
