#!/bin/bash -e
{ # this ensures the entire script is downloaded #

# Stops the execution of a script if a command or pipeline has an error
set -e

# Functiom that prints the latest stable version
version() {
  echo "0.0.2"
}

echo "cleaning up folder..."

# Remove node modules
if [ -d "node_modules" ]; then
	rm node_modules -R
fi

echo "Downloading latest version from github $(version)"

#download latest
wget https://github.com/MKHenson/noxy/archive/v$(version).zip
unzip -o "v$(version).zip" "noxy-$(version)/*"

# Moves the server folder to the current directory
mv noxy-$(version)/server/* .

# Remove noxy folder
if [ -d "noxy-$(version)" ]; then
	rm noxy-$(version) -R
fi

# Remove the zip file
rm "v$(version).zip"

if [ !-d "config.json" ]; then
	# Copy the example config to a config.json
	cp "example-config.json" "config.json"
fi


# All done
echo "Noxy successfully installed"
echo "Please run an NPM update and edit the config.json"
exit
} # this ensures the entire script is downloaded #