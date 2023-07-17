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
  if os.path.exists('logs/radio_data.csv'):
    os.remove('logs/radio_data.csv')
  if os.path.exists('logs/radio_errors.csv'):
    os.remove('logs/radio_errors.csv')

if __name__ == '__main__':
  runner = unittest.TextTestRunner()
  runner.run(suite())
  tearDown()
