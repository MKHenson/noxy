#!/bin/bash -e
{ # this ensures the entire script is downloaded #

# Stops the execution of a script if a command or pipeline has an error
set -e

# Functiom that prints the latest stable version
version() {
  echo "0.1.0"
}

echo "Downloading latest version from github $(version)"

#download latest
wget https://github.com/MKHenson/noxy/archive/v$(version).zip
unzip -o "v$(version).zip" "noxy-$(version)/*"

# Moves the server folder to the current directory
cp -r noxy-$(version)/server/* .

# Remove noxy temp folder
if [ -d "noxy-$(version)" ]; then
	rm noxy-$(version) -R
fi

# Remove the zip file
rm "v$(version).zip"

# Copy the example config to a config.json as long as config.json does not exist
if [ ! -f "config.json" ]; then
	cp "example-config.json" "config.json"
fi


# All done
echo "Noxy successfully installed"
echo "Please run an NPM update and edit the config.json"
exit
} # this ensures the entire script is downloaded #