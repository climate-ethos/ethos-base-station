# Random number of seconds between 0-10 minutes
# This ensures that Raspberry Pi's dont all try and update at exact same time
WAIT_SECS=$((RANDOM % 10 * 60))
echo "Update script sleeping for $WAIT_SECS seconds"
sleep $WAIT_SECS

echo "Checking for updates..."

# This is needed as it is run from cron
cd /home/pi/ethos-raspberry-pi

# Check for changes in the remote repository
git fetch

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

# Check if there are any new changes
if [ $LOCAL != $REMOTE ]; then
    echo "Updates found, updating app..."
    # Pull the changes
    git pull

    # Rebuild Electron app
    sh pi_build.sh

    # Restart services
    sudo systemctl restart ethos-electron-app.service
    sudo systemctl restart ethos-python-server.service
else
    echo "No updates found."
fi
