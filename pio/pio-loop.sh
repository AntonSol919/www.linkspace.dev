#!/bin/sh
. "$(dirname "$0")/set-env.sh"
xdg-open "$URL" >&2 || echo "$URL" >&2
while true; do
	ws-stdio -a "0.0.0.0:$PORT" -p "$PASS" "$@"
done
