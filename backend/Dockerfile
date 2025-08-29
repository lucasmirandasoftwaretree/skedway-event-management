FROM php:8.3-fpm
RUN apt-get update && apt-get install -y unzip git libzip-dev libicu-dev libonig-dev libpq-dev libssl-dev
RUN docker-php-ext-install pdo pdo_mysql intl
RUN pecl install redis && docker-php-ext-enable redis
WORKDIR /var/www/html
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer --version
