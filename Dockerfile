FROM node

WORKDIR /usr/src/database_server

COPY . .

RUN npm install

EXPOSE 3002

CMD ["node", "./app.js"]
