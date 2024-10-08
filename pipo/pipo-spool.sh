#!/bin/sh -xe
exec 4>&1 1>&2 # make sure echo's go to stderr and not stdout

. "$(dirname "$0")/set-env.sh"

echo "$PASS"
echo "$URL"
SPOOL="$1"
LOCKFILE="$SPOOL.lock"
if ! ln -s "$SPOOL" "$LOCKFILE" 2>/dev/null; then
	echo "$LOCKFILE exists."
	exit 1
fi
touch "$SPOOL"

cleanup() {
	echo removing lock
	rm -f "$LOCKFILE"
	exit 0
}
trap cleanup EXIT INT
export SPOOL

COUNTER=0
touch "$SPOOL"
while true; do
	TIMESTAMP=$(date +"%Y%m%d%H%M%S")
	export OUT="$SPOOL.$TIMESTAMP.$COUNTER"
	ln "$SPOOL" "$OUT"
	ws-stdio -a "0.0.0.0:$PORT" -p "$PASS" -- /bin/sh -x -c 'pwd >&2 ; tail -f "$OUT"' >&4 || echo "ws-pipe error? "
	rm -f "$SPOOL"
	touch "$SPOOL"
	sleep 1
done
