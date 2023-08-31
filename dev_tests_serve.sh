# Start docker (for CouchDB)
docker-compose up &

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py &
python_pid=$! # Store PID of the last background process
cd ..

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

# Serve test page
cd javascript_ui
yarn test:serve
cd ..

# After tests, shut down processes
kill $python_pid # Kill Python process
docker-compose down # Bring down docker container and reset database
