#!/bin/bash

# Para hacer que este script se ejecute automáticamente, hay que añadirlo a crontab
# sudo crontab -e
# 0 12 * * * /home/ocre/ocre.soy/server_ssl_renew.sh >> /var/log/cron.log 2>&1

COMPOSE="/usr/bin/docker compose --ansi never"
DOCKER="/usr/bin/docker"

cd /home/ocre/ocre.soy
$COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP nginx
$DOCKER system prune -af
