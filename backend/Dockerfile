FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm ci

COPY tsconfig*.json nest-cli.json ./
COPY src/ ./src/

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]
