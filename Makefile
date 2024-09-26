.PHONY: pkg all homepage rust-docs tutorials guide  clean

all: clean homepage rust-docs tutorials guide

index.html: $(wildcard index/*)
	pandoc ./index/*.md --template ./index/template.htm --metadata title="Linkspace" -t html5 -o $@



rust-docs:
	mkdir -p build
	cargo doc --manifest-path ../linkspace/Cargo.toml -p linkspace --target-dir ./build --no-deps
	rsync -rvkP ./build/doc/ ./docs/rust

build-debug:
	make -C ../linkspace build-debug

jspkg:
	rm ./js/latest -r || true
	make -C ../linkspace/ffi/linkspace-js 
	rsync -rvkP --include "linkspace.js/***" --include "web-sign/***" --include "web-component/***" --exclude "*" ./../linkspace/examples/ ./js/latest

homepage: build-debug index.html about.html code_intro.html

clean:
	rm -r build || true
	rm -r docs/rust || true
	find . -name "*.html" -type f -delete
