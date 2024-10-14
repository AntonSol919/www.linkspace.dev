#!/bin/sh
. "$(dirname "$0")/set-env.sh"
xdg-open "$URL" >&2 || echo "$URL" >&2
exec ws-stdio -a "0.0.0.0:$PORT" -p "$PASS" "$@"
