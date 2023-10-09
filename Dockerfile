FROM node:18-alpine as base
USER node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM node:18-alpine as production
USER node
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /usr/src/app/dist ./dist
ENTRYPOINT ["node", "dist/index.js"]