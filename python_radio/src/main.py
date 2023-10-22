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

  # Start radio listen
  while True:
    sensorId = radio_listen(rfm9x)
    if sensorId:
      active_sensor_ids[sensorId] = time.time()

    prune_old_ids(active_sensor_ids, TIME_LIMIT)

    # Display sorted list of active sensor IDs
    clear_terminal()
    print(sorted(active_sensor_ids.keys()))