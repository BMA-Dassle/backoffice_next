FROM node:20-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --legacy-peer-deps && npm install typescript -g
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

RUN npm run build

FROM node:lts-slim

RUN npm install -g serve

RUN chown -R node:node /home

RUN apt-get update && apt-get install -y curl && curl -fsS https://dotenvx.sh/ | sh

RUN apt-get remove curl -y && apt-get autoremove -y

USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY .env.production ./
COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

EXPOSE 80
EXPOSE 443

CMD ["dotenvx", "run",  "--env-file=.env.production", "--","npm", "run", "start"]