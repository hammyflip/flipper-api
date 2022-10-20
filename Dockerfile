FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN npx prisma generate
RUN yarn tsc

ENV NODE_ENV dev

EXPOSE 4001
# Use this in dev
CMD [ "yarn", "nodemon" ]
# ENV NODE_PATH ./dist
# CMD [ "node", "dist/src/index.js" ]
USER node

