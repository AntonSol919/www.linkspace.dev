.PHONY: all 

MD_PAGES := $(wildcard ./*.md)
ORG_PAGES := $(wildcard ./*.org)
PAGES := $(patsubst ./%.md,./%.html,$(MD_PAGES)) $(patsubst ./%.org,./%.html,$(ORG_PAGES)) 

all : $(PAGES) 

# ORG HTML EXPORT
%.html: %.org ../org-utils.org
	emacsclient --eval "(progn (switch-to-buffer (find-file-noselect \"./$<\")) (org-html-export-to-html))"

%.html: %.md ../log.js
	pandoc --embed-resources --standalone $< > $@

