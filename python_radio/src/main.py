from radio import radio_listen
import os
import platform
import time

try:
  import board
  import busio
  from digitalio import DigitalInOut
  import adafruit_rfm9x
except:
  print("Unable to import radio modules, are you on RPi?")

TIME_LIMIT = 21 * 60  # 25 minutes in seconds

def clear_terminal():
  if platform.system() == "Windows":
    os.system("cls")
  else:
    os.system("clear")

# Function to configure LoRa Radio
def radio_init():
  RADIO_FREQ_MHZ = 915.1  # Frequency of the radio in Mhz
  CS = DigitalInOut(board.CE1)
  RESET = DigitalInOut(board.D25)
  spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
  rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
  rfm9x.tx_power = 23
  return rfm9x

def prune_old_ids(sensor_dict, time_limit):
    """Remove entries older than the specified time_limit."""
    current_time = time.time()
    ids_to_remove = [sensorId for sensorId, timestamp in sensor_dict.items() if current_time - timestamp > time_limit]
    for sensorId in ids_to_remove:
      del sensor_dict[sensorId]

if __name__ == '__main__':
  rfm9x = radio_init()
  active_sensor_ids = {}
  unable_to_get_measurement_ids = {}
  invalid_sensor_values_ids = {}
  error_initializing_sensor_ids = {}
  invalid_voltage_ids = {}

  # Start radio listen
  while True:
    radio_data = radio_listen(rfm9x)
    if radio_data is None:
      continue

    # Extract data from radio data
    sensorId = radio_data["id"]
    temperature = radio_data["temperature"]
    humidity = radio_data["humidity"]
    voltage = radio_data["voltage"]

    if sensorId:
      active_sensor_ids[sensorId] = time.time()

      if temperature == -900 or humidity == -900:
        unable_to_get_measurement_ids[sensorId] = time.time()
      elif temperature == -800 or humidity == -800:
        invalid_sensor_values_ids[sensorId] = time.time()
      elif temperature == -700 or humidity == -700:
        error_initializing_sensor_ids[sensorId] = time.time()
      elif voltage == -900:
        invalid_voltage_ids[sensorId] = time.time()

    prune_old_ids(active_sensor_ids, TIME_LIMIT)
    prune_old_ids(unable_to_get_measurement_ids, TIME_LIMIT)
    prune_old_ids(invalid_sensor_values_ids, TIME_LIMIT)
    prune_old_ids(error_initializing_sensor_ids, TIME_LIMIT)
    prune_old_ids(invalid_voltage_ids, TIME_LIMIT)

    # Display sorted list of active sensor IDs
    clear_terminal()
    print("Active sensor IDs:", sorted(active_sensor_ids.keys()))
    print("Unable to get measurement:", sorted(unable_to_get_measurement_ids.keys()))
    print("Invalid sensor values:", sorted(invalid_sensor_values_ids.keys()))
    print("Error initializing sensor:", sorted(error_initializing_sensor_ids.keys()))
    print("Invalid voltage:", sorted(invalid_voltage_ids.keys()))