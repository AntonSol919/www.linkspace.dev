#!/bin/sh

if ! command -v ws-stdio >/dev/null; then
	/bin/sh -c "cd $HOME/Projects/linkspace ; cargo build -p ws-stdio"
	export PATH="$PATH:$HOME/Projects/linkspace/target/debug/"
fi

export PORT="${PORT:-14890}"
export PASS="${PASS:-${2:-$(tr -dc A-Za-z0-9 </dev/urandom | head -c 13)}}"
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5015; then
	export URL="http://127.0.0.1:5015/pipo/index.html?port=$PORT&pass=$PASS"
else
	export URL="http://www.alinkspace.dev/pipo/index.html?addr=127.0.0.1:$PORT&pass=$PASS"
	cat >&2 <<EOF
WARN: If your browser automatically upgrades http to https then this will fail.
Browsers do not allow https pages to contact over plain 'ws', but require a secure 'wss'. 
For testing either:
  - launch your own pipo webhost ( serve-examples.sh or $(python -m http.server EXAMPLE_DIR))
  - put your ws behind a nginx proxy
EOF
fi
