FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.3-alpine AS production
RUN apk add mc
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /opt/site/
