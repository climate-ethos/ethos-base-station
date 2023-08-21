# Setup docker environment (for CouchDB)
docker-compose build
# Setup javascript npm
cd javascript_ui
yarn install
# Setup python environment
cd ../python_radio
python3 -m venv ./env
source ./env/bin/activate
pip3 install -r requirements.txt