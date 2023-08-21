# Start docker (for CouchDB)
docker-compose up & # Ensure that process does not block
# Open quasar program in new window
cd javascript_ui
yarn start & # Ensure that process does not block
cd ..

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py