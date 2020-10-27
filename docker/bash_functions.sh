
# see master/4/debian-10/prebuildfs/opt/bitnami/base/functions
# from github.com/bitnami/bitnami-docker-express
[[ ${BASH_DEBUG:-false} = true ]] && set -x

# Constants
MODULE="$(basename "$0")"
#!/bin/bash
#
# Library for logging functions

# Constants
RESET='\033[0m'
RED='\033[38;5;1m'
GREEN='\033[38;5;2m'
YELLOW='\033[38;5;3m'
MAGENTA='\033[38;5;5m'
CYAN='\033[38;5;6m'

# Functions

########################
# Print to STDERR
# Arguments:
#   Message to print
# Returns:
#   None
#########################
stderr_print() {
    # 'is_boolean_yes' is defined in libvalidations.sh, but depends on this file so we cannot source it
    local bool="${BITNAMI_QUIET:-false}"
    # comparison is performed without regard to the case of alphabetic characters
    shopt -s nocasematch
    if ! [[ "$bool" = 1 || "$bool" =~ ^(yes|true)$ ]]; then
        printf "%b\\n" "${*}" >&2
    fi
}

########################
# Log message
# Arguments:
#   Message to log
# Returns:
#   None
#########################
log() {
    stderr_print "${CYAN}${MODULE:-} ${MAGENTA}$(date "+%T.%2N ")${RESET}${*}"
}
########################
# Log an 'info' message
# Arguments:
#   Message to log
# Returns:
#   None
#########################
info() {
    log "${GREEN}INFO ${RESET} ==> ${*}"
}
########################
# Log message
# Arguments:
#   Message to log
# Returns:
#   None
#########################
warn() {
    log "${YELLOW}WARN ${RESET} ==> ${*}"
}
########################
# Log an 'error' message
# Arguments:
#   Message to log
# Returns:
#   None
#########################
error() {
    log "${RED}ERROR${RESET} ==> ${*}"
}
########################
# Log a 'debug' message
# Globals:
#   BITNAMI_DEBUG
# Arguments:
#   None
# Returns:
#   None
#########################
debug() {
    # 'is_boolean_yes' is defined in libvalidations.sh, but depends on this file so we cannot source it
    local bool="${BITNAMI_DEBUG:-false}"
    # comparison is performed without regard to the case of alphabetic characters
    shopt -s nocasematch
    if [[ "$bool" = 1 || "$bool" =~ ^(yes|true)$ ]]; then
        log "${MAGENTA}DEBUG${RESET} ==> ${*}"
    fi
}

########################
# Indent a string
# Arguments:
#   $1 - string
#   $2 - number of indentation characters (default: 4)
#   $3 - indentation character (default: " ")
# Returns:
#   None
#########################
indent() {
    local string="${1:-}"
    local num="${2:?missing num}"
    local char="${3:-" "}"
    # Build the indentation unit string
    local indent_unit=""
    for ((i = 0; i < num; i++)); do
        indent_unit="${indent_unit}${char}"
    done
    echo "$string" | sed "s/^/${indent_unit}/"
}



########################
# Wait for service to be reachable
# Arguments:
#   $1 - host (default: localhost)
#   $2 - port (default: 3306)
#   $3 - maximum number of retries (default: 10)
# Returns:
#   None
#########################
wait_for_db() {
  if ! [[ -n $SKIP_DB_WAIT && $SKIP_DB_WAIT -gt 0 ]]
  then
    local host=${1:-'localhost'}
    local port=${2:-'3306'}
    local ip_address
    ip_address=$(getent ahosts "$host" | grep STREAM | head -n 1 | cut -d ' ' -f 1)

    info "Connecting to $host server at $ip_address:$port.\n"

    max_count=${3:-10}
    counter=0
    until nc -z "$host" "$port"; do
      counter=$((counter+1))
      if [ $counter == $max_count ]; then
        error "Couldn't connect to $host server.\n"
        return 1;
      fi
      info "Trying to connect to $host server at $ip_address:$port. Attempt $counter.\n"
      sleep 5
    done
    info "Connected to $host server."
  fi
}

# migrate_db() {
#   if ! [[ -n $SKIP_DB_MIGRATE && $SKIP_DB_MIGRATE -gt 0 ]] && [[ -f .sequelizerc ]]; then
#     info "Applying database migrations (sequelize db:migrate)."
#     sequelize db:migrate
#   fi
# }

# add_nodemon_support() {
#   info "Adding nodemon npm module (dev)."
#   npm install nodemon --save-dev
#   sed -i 's;"start".*;"start": "node ./bin/www", "development": "nodemon ./bin/www";' package.json
# }

# install_packages() {
#   if ! dependencies_up_to_date; then
#     if ! [[ -n $SKIP_NPM_INSTALL && $SKIP_NPM_INSTALL -gt 0 ]] && [[ -f package.json ]]; then
#       info "Installing npm packages."
#       npm install
#     fi
#   fi
# }

