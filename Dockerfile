
# Stage 1: Build the application
FROM node:17-alpine as builder
WORKDIR /c/desenvolvimento/DNIT/SIMA/sistema_sim_frontend/

RUN yarn --force

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:1.19.0

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar o arquivo de configuração personalizado
COPY nginx.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copiar os arquivos construídos do estágio anterior
COPY --from=builder /c/desenvolvimento/DNIT/SIMA/sistema_sim_frontend/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
