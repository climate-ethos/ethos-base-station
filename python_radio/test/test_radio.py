import unittest
from radio import process_packet

class TestRadio(unittest.TestCase):
  def test_valid_packet(self):
    packet = b"I123T24.5H55.6"
    expected_result = {"id": "123", "temperature": "24.5", "humidity": "55.6"}
    self.assertEqual(process_packet(packet), expected_result)

  def test_valid_packet_longer(self):
    packet = b"I123T24.5H55.6\x00\x00\x02\x00\x00\x00"
    expected_result = {"id": "123", "temperature": "24.5", "humidity": "55.6"}
    self.assertEqual(process_packet(packet), expected_result)

  def test_valid_packet_longer_corruption(self):
    packet = b"I123T24.5H55.6\x00\x00\xef\xff\xff\xdf"
    expected_result = {"id": "123", "temperature": "24.5", "humidity": "55.6"}
    self.assertEqual(process_packet(packet), expected_result)

  def test_invalid_packet(self):
    packet = b"InvalidPacket"
    self.assertIsNone(process_packet(packet))

  def test_non_ascii_packet(self):
    packet = bytearray([0x80, 0x81, 0x82, 0x83])
    self.assertIsNone(process_packet(packet))

if __name__ == '__main__':
    unittest.main()
