FROM node:18-alpine

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN ls -l dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
