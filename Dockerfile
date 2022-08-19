FROM node:lts-alpine as development

WORKDIR /home/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:lts-alpine as production

EXPOSE 4000

ENV NODE_ENV=production

WORKDIR /home/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /home/app/dist ./dist
COPY src ./src
COPY doc ./doc
COPY logs ./logs
