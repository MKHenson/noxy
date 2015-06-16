#!/bin/bash -e
{ # this ensures the entire script is downloaded #

# Stops the execution of a script if a command or pipeline has an error
set -e

echo "Downloading latest version from github dev"

#download latest
wget https://github.com/MKHenson/noxy/archive/dev.zip
unzip -o "dev.zip" "noxy-dev/*"

# Moves the server folder to the current directory
cp -r noxy-dev/server/* .

# Remove noxy temp folder
if [ -d "noxy-dev" ]; then
	rm noxy-dev -R
fi

# Remove the zip file
rm "dev.zip"

# Copy the example config to a config.json as long as config.json does not exist
if [ ! -f "config.json" ]; then	
	cp "example-config.json" "config.json"
fi


# All done
echo "Noxy successfully installed"
echo "Please run an NPM update and edit the config.json"
exit
} # this ensures the entire script is downloaded #
