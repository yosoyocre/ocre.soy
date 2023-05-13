#!/bin/sh
set -e

echo "Deploy de la aplicación..."

# Actualizamos el código
git fetch origin master
git reset --hard origin/master

# Copiamos el contenido de dev_docker-compose.yml a docker-compose.yml
# para no tener que indicar todo el rato qué fichero usar
cp -f server_docker-compose.yml docker-compose.yml

# Instalamos dependencias basadas en el archivo lock
docker exec ocre-app composer install --no-interaction --prefer-dist

# Forzamos el reinicio de php-fpm
# https://stackoverflow.com/questions/37806188/how-to-restart-php-fpm-inside-a-docker-container
docker exec ocre-app bash -c "kill -USR2 1"

chmod +x server_ssl_renew.sh

echo "Deploy terminado!"