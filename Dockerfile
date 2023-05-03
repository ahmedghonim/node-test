FROM node:16 as base

FROM base as prod
WORKDIR /app

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3005

CMD ["yarn", "dev"]

FROM base as dev

WORKDIR /app

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3005

CMD ["npm","run" ,"dev"]