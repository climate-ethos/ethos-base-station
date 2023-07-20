# cd javascript_ui
# Need to use absolute path to work from rc.local for startup
cd ~/Documents/GitHub/ethos-raspberry-pi/javascript_ui
'./dist/electron/Packaged/Ethos Heat Monitor-linux-armv7l/Ethos Heat Monitor' & # Ensure that process does not block python script
cd ..

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py production