import unittest
import os
from logger import Logger

class TestLogger(unittest.TestCase):

  def setUp(self):
    # This method will be called before each test
    self.radio_data = {
      "id": "Test ID",
      "temperature": "Test Temperature",
      "humidity": "Test Humidity"
    }
    self.rssi = "Test RSSI"
    self.error_message = "Test error"

  def test_error(self):
    Logger.error(self.error_message)
    self.assertTrue(os.path.exists('logs/radio_errors.csv'))

  def test_log_radio_data(self):
    Logger.log_radio_data(self.radio_data, self.rssi)
    self.assertTrue(os.path.exists('logs/radio_data.csv'))

if __name__ == '__main__':
    unittest.main()
