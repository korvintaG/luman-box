FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19-alpine AS production
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /opt/site/
