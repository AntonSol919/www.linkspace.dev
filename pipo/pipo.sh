#!/bin/sh -x
/bin/sh -c "cd ~/Projects/linkspace ; cargo build -p ws-stdio"
WS_STDIO=~/Projects/linkspace/target/debug/ws-stdio

. "$(basename "$0")/set-env.sh"

echo $URL >&2
xdg-open $URL

$WS_STDIO -a 0.0.0.0:$PORT -p "$PASS" "$@"
