FROM node:10

WORKDIR /creatanium
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 3000
CMD [ "yarn", "start" ]