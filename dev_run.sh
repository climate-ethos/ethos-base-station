echo "Starting development build..."

# Import utility functions
source dev_utils.sh

# Ensure cleanup is run everytime script is terminated or exited
trap cleanup EXIT INT TERM

# Start docker (for CouchDB)
start_docker

# Run python socket server
start_python

# Wait for couchdb to start
wait_for_couchdb

# Create example user (id: 999)
create_test_user

# Wait for user database to be setup
wait_for_user_db

# Create views for that user
create_sensor_view_with_retry

# Open quasar program in new window
cd javascript_ui
yarn start
cd ..