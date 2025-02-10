# FROM node:18 as build

# # Establece el directorio de trabajo
# WORKDIR /app

# # Copia los archivos para la instalación
# COPY package*.json ./
# COPY . .

# # Instala las dependencias
# RUN npm install

# # Construye la aplicación
# RUN npm run build

# # Usa una imagen más ligera
# FROM nginx:alpine

# # Copia los archivos de construcción al contenedor de nginx
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copia la configuración personalizada de nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Exponer el puerto 80
# EXPOSE 80

# # Comando para iniciar nginx
# CMD ["nginx", "-g", "daemon off;"]
# Etapa de construcción

# Etapa de construcción
# Imagen base de Node.js
FROM node:18 as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./
COPY . ./

# Instalar dependencias
RUN npm install

# Construir el proyecto
RUN npm run build

# Usar una imagen más ligera para producción
FROM nginx:alpine

# Copiar la compilación al contenedor de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configurar Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
