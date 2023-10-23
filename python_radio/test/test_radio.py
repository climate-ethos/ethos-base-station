import unittest
from radio import process_packet, decrypt_data

class TestRadio(unittest.TestCase):
  def test_valid_packet(self):
    packet = b"\x01\x00\x00\x00\x00\x00\xC8\x41\x7C\x56\x2C\x42\x9A\x91\x89\x40"
    rssi = -70.6
    expected_result = {"id": 1, "temperature": 25.00, "humidity": 43.08445739746094, "voltage": 4.299023628234863, "rssi": rssi}
    self.assertEqual(process_packet(packet, rssi), expected_result)

  def test_encrypted_packet(self):
    # This may need to be adjusted depending on what AES_KEY is being used
     encrypted_packet = b"\xF5\xC0\xFF\x94\xFB\xBC\x18\xDA\xE6\x45\xBB\x68\xF8\xE5\x06\x5A"
     decrypted_packet = b"\x01\x00\x00\x00\x00\x00\xC8\x41\x7C\x56\x2C\x42\x9A\x91\x89\x40"
     self.assertEqual(decrypt_data(encrypted_packet), decrypted_packet)

  def test_invalid_packet(self):
    packet = b"InvalidPacketSet"
    rssi = -70.6
    self.assertIsNone(process_packet(packet, rssi))

  def test_short_packet(self):
    packet = bytearray([0x80, 0x81, 0x82, 0x83])
    rssi = -70.6
    self.assertIsNone(process_packet(packet, rssi))

  def test_long_packet(self):
    packet = bytearray([0x80, 0x81, 0x82, 0x83, 0x80, 0x81, 0x82, 0x83, 0x80, 0x81, 0x82, 0x83, 0x80, 0x81, 0x82, 0x83, 0x80, 0x81, 0x82, 0x83])
    rssi = -70.6
    self.assertIsNone(process_packet(packet, rssi))

if __name__ == '__main__':
    unittest.main()
