# RUN JS TESTS
cd javascript_ui
echo "-----\nTesting Javascript UI:\n-----"
npm run test:unit:ci
cd ..

# RUN PYTHON TESTS
cd python_radio
. ./env/bin/activate
# Find and run all tests inside `tests` directory
echo "-----\nTesting Python Code:\n-----"
PYTHONPATH=./src python3 test/main.py
cd ../..