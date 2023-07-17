
from adafruit_rfm9x import RFM9x
import socketio
import re
from logger import Logger

async def radio_listen(sio: socketio.AsyncServer, rfm9x: RFM9x):
  # Radio listen loop
  while True:
    try:
      radio_packet = rfm9x.receive(timeout=5.0)
    except Exception as e:
      Logger.error(f"Error receiving packet: {e}")
      continue

    if radio_packet is None:
      print("Nothing received, trying again...")
      continue

    # Radio packet received
    try:
      radio_data = process_packet(radio_packet)
    except Exception as e:
      Logger.error(f"Error processing packet: {e}")
      continue

    if radio_data is None:
      continue

    try:
      acknowledgement_data = bytes("R" + radio_data["id"] + "\r\n","utf-8")
      rfm9x.send(acknowledgement_data)
    except Exception as e:
      Logger.error(f"Error sending acknowledgement: {e}")

    # Log radio data
    rssi = rfm9x.last_rssi
    Logger.log_radio_data(radio_data, rssi)
    try:
      await sio.emit('data', radio_data)
    except Exception as e:
      Logger.error(f"Error emitting data: {e}")


def process_packet(packet: bytearray):
  print("Packet received:", packet)
  try:
    # Slice packet to the first 14 bytes
    # The radio actually sends 15 bytes, however the last byte is \x00 and can be ignored
    packet = packet[:14]
    packet_text = str(packet, "ascii")
    print("(ASCII): {0}".format(packet_text))

    match = re.match("^I(\d+)T([\d\.]+)H([\d\.]+)", packet_text)
    if match is None:
      print("Incorrect radio message!")
      return None

    return {
      "id": match[1],
      "temperature": match[2],
      "humidity": match[3]
    }
  except Exception as e:
    Logger.error(f"Error processing packet: {e}")
