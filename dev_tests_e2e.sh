# Start docker (for CouchDB)
docker-compose up > /dev/null 2>&1 & # redirect all output away from console and stop blocking

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py > /dev/null 2>&1 & # redirect all output away from console and stop blocking
python_pid=$! # Store PID of the last background process
cd ..

# Give time for everything to start up
echo "Starting tests..."

# Function to wait for CouchDB to start
wait_for_couchdb() {
    for _ in {1..15}; do # Try for 15 seconds
        if curl -s -u admin:password http://localhost:5984/ >/dev/null; then
            return 0
        fi
        sleep 1
    done
    echo "CouchDB did not start in time"
    exit 1
}
wait_for_couchdb

# Create test user on DB
curl -X PUT http://localhost:5984/_users/org.couchdb.user:999 \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -u admin:password \
     -d '{"name": "999", "password": "12345", "roles": [], "type": "user"}'

# Run tests
cd javascript_ui
yarn test:e2e:ci
cd ..

# After tests, shut down processes
kill $python_pid # Kill Python process
docker-compose down # Bring down docker container and reset database
