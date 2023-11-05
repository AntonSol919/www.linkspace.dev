all: index.html

# ORG HTML EXPORT
%.html: %.org ../org-utils.org
	emacsclient --eval "(progn (switch-to-buffer (find-file-noselect \"./$<\")) (org-html-export-to-html))"
