import csv
import datetime
import os

class Logger:

  @staticmethod
  def log_radio_data(radio_data, rssi):
    id = radio_data.get("id", "Missing ID")
    temp = radio_data.get("temperature", "Missing Temperature")
    humidity = radio_data.get("humidity", "Missing Humidity")
    print("Radio data.. id: {0}, temp: {1}, RH: {2}, RSSI: {3}".format(id, temp, humidity, rssi))

    os.makedirs('logs', exist_ok=True)
    with open('logs/radio_data.csv', 'a', newline='') as datafile:
      data_writer = csv.writer(datafile)
      # Write header if the file is empty
      if datafile.tell() == 0:
        data_writer.writerow(['Time', 'ID', 'Temperature', 'Humidity', 'RSSI'])
      data_writer.writerow([datetime.datetime.now(), id, temp, humidity, rssi])

  @staticmethod
  def error(msg):
    print(msg)

    os.makedirs('logs', exist_ok=True)
    with open('logs/radio_errors.csv', 'a', newline='') as errorfile:
      error_writer = csv.writer(errorfile)
      # Write header if the file is empty
      if errorfile.tell() == 0:
        error_writer.writerow(['Time', 'Error'])
      error_writer.writerow([datetime.datetime.now(), msg])
