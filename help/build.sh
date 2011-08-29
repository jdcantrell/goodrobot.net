#/bin/bash
CSS=0
HTML=0
if [ "$#" -eq 0 ]; then
	CSS=1
	HTML=1
else
	for i in $*
	do
		if [ "$1" = "-css" ]; then
			CSS=1
		fi
		if [ "$1" = "-html" ]; then
			HTML=1
		fi
	done
fi

if [ "$CSS" -eq 1 ]; then
	echo "Compiling sass to css..."
	compass compile ./
fi
if [ "$HTML" -eq 1 ]; then
	echo "Generated static html..."
	jekyll 
fi

echo "Done!"
