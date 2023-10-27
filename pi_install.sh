echo "Setting up JavaScript npm..."
cd javascript_ui
yarn install
cd ..

echo "Setting up Python environment..."
cd python_radio
python3 -m venv ./env
# Use dot as alias for 'source'
. ./env/bin/activate
sudo pip3 install -r requirements.txt

echo "Installing adafruit blinka..."
cd install_scripts
sudo python3 raspi-blinka.py

cd ../..

echo "Installing services..."
sudo cp systemd_services/ethos-electron-app.service /etc/systemd/system/
sudo cp systemd_services/ethos-python-server.service /etc/systemd/system/

echo "Reloading systemd and enabling services..."
sudo systemctl daemon-reload
sudo systemctl enable ethos-electron-app.service
sudo systemctl enable ethos-python-server.service

echo "Setting up cron job for auto-updating..."
echo "WARNING: This will overwrite any existing cron jobs!"
# Update will occur randomly between 2-3am
echo "0 2 * * * /home/pi/ethos-raspberry-pi/pi_check_update.sh" > /tmp/mycron
echo "0 5 * * * DISPLAY=:0 xset dpms force on" >> /tmp/mycron
crontab /tmp/mycron
rm /tmp/mycron

echo "Modifying sudoers to allow systemctl commands without a password..."
# Create a temporary sudoers file with the entry
echo "pi ALL=(ALL) NOPASSWD: /bin/systemctl restart ethos-electron-app.service, /bin/systemctl restart ethos-python-server.service" > /tmp/sudoers_temp
# Check the temporary sudoers file for syntax errors, and append it to the main sudoers file if it's okay
sudo visudo -cf /tmp/sudoers_temp
if [ $? -eq 0 ]; then
    cat /tmp/sudoers_temp | sudo tee -a /etc/sudoers
    echo "sudoers file updated successfully."
else
    echo "Failed to update sudoers file. Please update it manually."
fi
# Remove the temporary sudoers file
rm /tmp/sudoers_temp

echo "Installation complete!"
