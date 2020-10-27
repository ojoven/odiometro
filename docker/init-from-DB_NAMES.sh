#!/bin/bash
source /scripts/bash_functions.sh

# To execute on MariaDB

# Debug commands
# service mysql status
# mysqladmin -u"$MYSQL_ROOT_USER" ping
# mysql -uroot -p$MYSQL_ROOT_PASSWORD -e '\q'
# mysql -uroot -p$MYSQL_ROOT_PASSWORD 'mysql' -e 'SHOW DATABASES'
# mysql -uroot -p$MYSQL_ROOT_PASSWORD 'mysql' -e 'select * from mysql.user'
# wait_for_db "127.0.0.1" "3306" 5

printf '========================================================================================\n'
info 'Initialize custom databases..'
info '[ you can define the desired databases as INIT_DB_NAMES="odiometro,amoreometro,.." ]'

IFS=',' read -ra db_names <<< "${INIT_DB_NAMES}"    # split database-names by comma
for db_name in "${db_names[@]}"
do
    info "Create database $db_name\n"
    # printf "mysql -uroot -p$MYSQL_ROOT_PASSWORD 'mysql' -e \"CREATE DATABASE $db_name\"\n"
    mysql -uroot -p$MYSQL_ROOT_PASSWORD 'mysql' -e "CREATE DATABASE $db_name"
    info "Apply schema to database \`$db_name\`\n"
    mysql -uroot -p$MYSQL_ROOT_PASSWORD "$db_name" < /schemas/app-schema.sql

    mysql -uroot -p$MYSQL_ROOT_PASSWORD 'mysql' -e "SHOW TABLES FROM $db_name"
done

mysql -uroot -p$MYSQL_ROOT_PASSWORD 'mysql' -e 'SHOW DATABASES'

printf '========================================================================================\n'
