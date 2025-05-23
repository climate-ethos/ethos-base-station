echo "Starting e2e tests..."

# Import utility functions
source dev_utils.sh

# Ensure cleanup is run everytime script is terminated or exited
trap cleanup EXIT INT TERM

# Start docker couchdb process
start_docker silent

# Run python socket server
start_python silent

# Wait for couchdb to start
wait_for_couchdb
# Create example user (id: 999)
create_test_user

# Wait for user database to be setup
wait_for_user_db
# Create views for that user
create_sensor_view_with_retry

# Run tests
cd javascript_ui
yarn test:e2e:ci
cd ..