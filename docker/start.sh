#!/bin/bash

# 启动 PHP-FPM
service php7.4-fpm start

# 启动 Nginx
nginx -g "daemon off;"
