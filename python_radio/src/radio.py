
from adafruit_rfm9x import RFM9x
import time
from typing import Union, Optional, TypedDict
from logger import Logger
# For unpacking binary data
import struct

# For typing stop_event
from threading import Event

# For radio encryption
from Crypto.Cipher import AES
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('../javascript_ui/.env')
load_dotenv(dotenv_path=dotenv_path)

# Get the AES_KEY from environment variables
AES_KEY_STRING = os.getenv('AES_KEY')
AES_KEY = AES_KEY_STRING.encode("utf-8")

class RadioData(TypedDict):
    id: int
    temperature: float
    humidity: float
    voltage: float
    rssi: float

def decrypt_data(data: bytes) -> bytes:
    """Decrypt data using AES in ECB mode."""
    cipher = AES.new(AES_KEY, AES.MODE_ECB)
    decrypted_data = cipher.decrypt(data)
    return decrypted_data

def radio_listen(rfm9x: RFM9x) -> Optional[RadioData]:
  # Radio listen loop
  try:
    radio_packet = rfm9x.receive(timeout=5.0)
  except Exception as e:
    Logger.error(f"Error receiving packet: {e}")
    return

  if radio_packet is None:
    # No data received, listen again
    return

  if len(radio_packet) < 16:
    # The radio packet must not be the right type
    Logger.error(f"Received packet of length {len(radio_packet)}")
    return

  if len(radio_packet) > 16:
    # We may have received some extra bytes in transit, try trimming them off the end
    Logger.warn(f"Received packet of length {len(radio_packet)}, trimming to 16 bytes")
    radio_packet = radio_packet[:16]

  # Decrypt recieved radio data
  try:
    decrypted_packet = decrypt_data(radio_packet)
  except:
    Logger.error(f"Error decrypting data")
    return

  # Process packet string to radio data
  rssi = rfm9x.last_rssi
  try:
    radio_data = process_packet(decrypted_packet, rssi)
  except Exception as e:
    Logger.error(f"Error processing packet: {e}")
    return

  if radio_data is None:
    # Radio data was of wrong type
    return

  # Log radio data
  Logger.log_radio_data(radio_data)
  # Return sensor data
  return radio_data


def process_packet(packet: bytearray, rssi: Union[float, int]) -> Optional[RadioData]:
  try:
    # Unpack the packet into respective fields "IIIITTTTHHHHVVVV"
    # Where I is ID, T is temperature, H is humidity and V is voltage
    sensorId, temperatureC, humidityRH, batteryVoltage = struct.unpack('ifff', packet)

    # Removed sanity check as we want to return all values

    return {
      "id": sensorId,
      "temperature": temperatureC,
      "humidity": humidityRH,
      "voltage": batteryVoltage,
      "rssi": rssi
    }
  except Exception as e:
    Logger.error(f"Error processing packet: {e}")
    return None
