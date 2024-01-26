.PHONY: all homepage rust-docs tutorials guide 

all: clean homepage rust-docs tutorials guide 
	echo "Use 'python -m http.server' before deadseeker"
	./build-scripts/deadseeker.py

rust-docs: 
	mkdir -p build
	cargo doc --manifest-path ../linkspace/Cargo.toml -p linkspace --target-dir ./build --no-deps
	rsync -rvkP ./build/doc/ ./docs/rust


tutorials: build-debug 
	make -C ./tutorial/

# This requires the latest `lk` to be in path - for my setup build-debug is sufficient
guide: build-debug 
	make -C ./guide/

build-debug: 
	make -C ../linkspace build-debug


jspkg: 
	rm -r ./pkg/latest || true
	wasm-pack build ../linkspace/ffi/linkspace-js --target web -d $(CURDIR)/pkg/latest

homepage: build-debug index.html about.html code_intro.html

# ORG PANDOC EXPORT 
%.html: %.org template.pml org-utils.org
	emacsclient --eval "(progn (switch-to-buffer (find-file-noselect \"./$<\")) (org-pandoc-export-to-html5))"

%.html: %.md template.pml
	pandoc -f markdown-native_divs -s ./$< --template ./template.pml  --metadata title=$@ -o $@

clean:
	rm -r build || true
	rm -r docs/rust || true
	find . -name "*.html" -type f -delete
