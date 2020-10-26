#!/bin/bash
set -e
source /scripts/bash_functions.sh

## Entry instructions

info "Wait for $APP_DATABASE_HOST:3306"
wait_for_db "${APP_DATABASE_HOST}" "3306" 6

exec "$@"
