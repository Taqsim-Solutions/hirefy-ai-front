FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY yarn* ./

RUN yarn install

COPY . .

ARG VITE_GOOGLE_AI_API_KEY
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_BASE_URL

ENV VITE_GOOGLE_AI_API_KEY=$VITE_GOOGLE_AI_API_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ["./default.conf", "/etc/nginx/conf.d/"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
