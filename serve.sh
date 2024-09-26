#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
exec nginx -p $PWD -e stderr -c ../linkspace/examples/nginx.conf
