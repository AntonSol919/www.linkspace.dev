
all: jspkg LKW+linkspace.js LKW+web-sign LKW+pipo LKW+web-component

jspkg:
	make -C ../linkspace/ffi/linkspace-js 

LKW+%:
	rsync -rvkP --include "$*/***" --exclude "*" ./../linkspace/examples/ ./
