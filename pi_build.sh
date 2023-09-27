# Run nvm setup
# This lets us run yarn in cron job
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Navigate to javascript directory
cd javascript_ui

# Backup the dist directory
if [ -d "dist" ]; then
  echo "Creating backup of dist directory"
  cp -r dist dist_backup || { echo "Failed to create backup of dist directory"; exit 1; }
fi

# Build electron App
yarn install
# If yarn build fails, restore dist from backup and exit
yarn build || {
  echo "Yarn build failed, restoring backup";
  rm -rf dist && cp -r dist_backup dist;
}

# Remove the backup folder
if [ -d "dist_backup" ]; then
  rm -rf dist_backup
fi

# Make built electron app executable
# chmod +x "dist/electron/Packaged/Ethos Heat Monitor-linux-armv7l/Ethos Heat Monitor"
chmod +x "dist/electron/Packaged/Ethos Heat Monitor-linux-arm64/Ethos Heat Monitor"
cd ..