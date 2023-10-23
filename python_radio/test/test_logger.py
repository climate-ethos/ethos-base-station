import unittest
import os
from logger import Logger
import time

class TestLogger(unittest.TestCase):

  def setUp(self):
    # This method will be called before each test
    self.radio_data = {
      "id": 999,
      "temperature": 32.39309,
      "humidity": 26.7323,
      "voltage": 3.79999,
      "rssi": -70.6221
    }
    self.error_message = "Test error"

  def test_error(self):
    Logger.error(self.error_message)
    self.assertTrue(os.path.exists('logs/radio_data.log'))
    with open('logs/radio_data.log', 'r') as f:
      content = f.read()
      # We dont want to save errors to the file
      self.assertFalse(self.error_message in content)

  def test_log_radio_data(self):
    Logger.log_radio_data(self.radio_data)
    self.assertTrue(os.path.exists('logs/radio_data.log'))
    with open('logs/radio_data.log', 'r') as f:
      content = f.read()
      # Ensure the log message is in content, and rounded
      line = "id: 999, temp: 32.39, RH: 26.73, voltage: 3.8, RSSI: -70.62"
      self.assertTrue(line in content)

if __name__ == '__main__':
  unittest.main()
