#!/usr/bin/env bash

WAIT_MSG="Waiting for mysql connection.."
while ! echo "select 1;" | mysql "--host=${MYSQL_DB_HOST}" --protocol=tcp \
                                 "--user=root" \
                                 "--password=${MYSQL_ROOT_PASSWORD}"
do
    [ -z "${WAIT_MSG}" ] && echo -n .
    [ ! -z "${WAIT_MSG}" ] && echo "${WAIT_MSG}" && WAIT_MSG=""
    sleep 5
done

! echo "CREATE DATABASE IF NOT EXISTS ${MYSQL_DB_NAME};" \
  | mysql "--host=${MYSQL_DB_HOST}" --protocol=tcp \
          "--user=root" \
          "--password=${MYSQL_ROOT_PASSWORD}" \
  && echo "Failed to create database, will try to continue anyway"

! echo "GRANT ALL ON ${MYSQL_DB_NAME}.* '${MYSQL_DB_USERNAME}'@'%' IDENTIFIED BY '${MYSQL_DB_PASSWORD}';" \
  | mysql "--host=${MYSQL_DB_HOST}" --protocol=tcp \
          "--user=root" \
          "--password=${MYSQL_ROOT_PASSWORD}" \
  && echo "Failed to create user, cannot continue" && exit 1

! node_modules/.bin/sequelize db:migrate && echo "Failed migrations" && exit 1

! npm run seed && echo "Failed seed" && exit 1

node server/server.js
