:: Start docker (for CouchDB)
call docker-compose up
:: Open quasar program in new window
cd javascript_ui
start cmd /C yarn start
cd ..

:: Run python
cd python_radio
call .\env\Scripts\activate.bat
python3 src\main.py