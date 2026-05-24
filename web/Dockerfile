FROM node:24-slim

WORKDIR /usr/src/web

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
