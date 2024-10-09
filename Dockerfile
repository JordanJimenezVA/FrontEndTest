# Usa una imagen base de Node.js para construir el frontend
FROM node:18 as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para la instalación y construcción
COPY package*.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Construye la aplicación
RUN npm run build

# Usa una imagen más ligera para servir el frontend
FROM nginx:alpine

# Copia los archivos de construcción al contenedor de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para servir la aplicación
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
