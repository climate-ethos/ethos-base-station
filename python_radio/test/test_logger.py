import unittest
import os
from logger import Logger
import time

class TestLogger(unittest.TestCase):

  def setUp(self):
    # This method will be called before each test
    self.radio_data = {
      "id": "999",
      "temperature": "32.3",
      "humidity": "26.7"
    }
    self.rssi = "-70dBm"
    self.error_message = "Test error"

  def test_error(self):
    Logger.error(self.error_message)
    self.assertTrue(os.path.exists('logs/radio_data.log'))
    with open('logs/radio_data.log', 'r') as f:
      content = f.read()
      self.assertTrue(self.error_message in content)

  def test_log_radio_data(self):
    Logger.log_radio_data(self.radio_data, self.rssi)
    self.assertTrue(os.path.exists('logs/radio_data.log'))
    with open('logs/radio_data.log', 'r') as f:
      content = f.read()
      # Ensure at least a part of the log message is in the content
      self.assertTrue(self.radio_data['id'] in content)

if __name__ == '__main__':
  unittest.main()
