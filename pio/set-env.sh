#!/bin/sh -e

if ! command -v ws-stdio >/dev/null; then
	if ! /bin/sh -c "cd $(dirname "$0"); cargo build -p ws-stdio" >&2; then
		echo "can't find ws-stdio - did you use activate to setup the path?" >&2
	fi
fi

export PORT="${PORT:-5021}"
export PASS="${PASS-$(tr -dc A-Za-z0-9 </dev/urandom | head -c 13)}"
if curl -s -o /dev/null http://127.0.0.1:5015; then
	export URL="http://127.0.0.1:5015/pio/index.html?port=$PORT&pass=$PASS"
else
	export URL="http://www.linkspace.dev/pio/index.html?addr=127.0.0.1:$PORT&pass=$PASS"
	cat >&2 <<EOF
WARN: If your browser automatically upgrades http to https then this might fail.
Browsers generally do not allow https pages to contact over plain 'ws', but require a secure 'wss'.
localhost 127.0.0.1 might be exempt from this rule in your browser.
Either:
  - disable auto https
  - launch your own pio webhost ( serve-examples.sh or python -m http.server EXAMPLE_DIR )
  - put your ws behind a proxy like nginx
EOF
fi
