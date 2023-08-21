import unittest
import os
from test_logger import TestLogger
from test_radio import TestRadio

def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestLogger))
  suite.addTest(unittest.makeSuite(TestRadio))
  # Add other test cases to the suite here
  return suite

def tearDown():
  # Clean up the log file after tests
  if os.path.exists('logs/radio_data.log'):
    os.remove('logs/radio_data.log')

if __name__ == '__main__':
  runner = unittest.TextTestRunner()
  runner.run(suite())
  tearDown()
