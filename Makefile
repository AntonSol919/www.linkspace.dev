.PHONY: all homepage rust-docs tutorials guide 

all: homepage rust-docs tutorials guide 

rust-docs: 
	cargo doc --manifest-path ../linkspace/Cargo.toml -p linkspace --target-dir ./build --no-deps
	rsync -rvkP ./build/doc/ ./docs/rust


tutorials: build-debug 
	make -C ./tutorial/

# This requires the latest `lk` to be in path - for my setup build-debug is sufficient
guide: build-debug 
	make -C ./guide/

build-debug: 
	make -C ../linkspace build-debug

homepage: build-debug index.html about.html code_intro.html

# ORG PANDOC EXPORT 
%.html: %.org template.pml
	emacsclient --eval "(progn (switch-to-buffer (find-file-noselect \"./$<\")) (org-pandoc-export-to-html5))"

%.html: %.md template.pml
	pandoc -f markdown-native_divs -s ./$< --template ./template.pml  --metadata title=$@ -o $@
