
all: jspkg LKW+linkspace.js LKW+web-sign LKW+pio LKW+web-component

jspkg:
	make -C ../linkspace/ffi/linkspace-js 

LKW+%:
	rm -r "./$*"
	rsync -rvkP --include "$*/***" --exclude "*" ./../linkspace/examples/ ./
