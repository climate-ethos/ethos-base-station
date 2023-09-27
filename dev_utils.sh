# Start docker (for CouchDB)
# Use `start_docker silent` to 'mute' terminal output
start_docker() {
    if [ "$1" = "silent" ]; then
        docker-compose up > /dev/null 2>&1 &
    else
        docker-compose up &
    fi
}

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

# Create test user on DB
create_test_user() {
    curl -X PUT http://localhost:5984/_users/org.couchdb.user:999 \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -u admin:password \
         -d '{"name": "999", "password": "12345", "roles": [], "type": "user"}'
}

# Start python server
# Use `start_python silent` to 'mute' terminal output
start_python() {
    cd python_radio
    . ./env/bin/activate
    if [ "$1" = "silent" ]; then
        python3 src/main.py > /dev/null 2>&1 &
    else
        python3 src/main.py &
    fi
    python_pid=$! # Store PID of the last background process
    cd ..
}

cleanup() {
    kill $python_pid  # Kill Python process
    docker-compose down  # Bring down docker container and reset database
}