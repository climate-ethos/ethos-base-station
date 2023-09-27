import logging
import os

class Logger:

    # Create a named logger instance
    _logger = logging.getLogger('my_application')

    @staticmethod
    def shutdown():
        logging.shutdown()

    @staticmethod
    def setup():
        # Clear any previously added handlers
        Logger._logger.handlers = []

        # Set the logging level
        Logger._logger.setLevel(logging.DEBUG)

        # Get the directory of the current script
        script_directory = os.path.dirname(os.path.realpath(__file__))
        # Go up one level to get to `python_radio`
        parent_directory = os.path.dirname(script_directory)
        # Add directory of logs file
        log_directory = os.path.join(parent_directory, "logs")
        if not os.path.exists(log_directory):
            os.makedirs(log_directory)
        # Create handlers
        file_handler = logging.FileHandler(os.path.join(log_directory, "radio_data.log"), mode='a')
        stream_handler = logging.StreamHandler()

        # Create a formatter and attach to handlers
        formatter = logging.Formatter(
            fmt='%(asctime)s %(levelname)-8s %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        stream_handler.setFormatter(formatter)

        # Attach handlers to the logger
        Logger._logger.addHandler(file_handler)
        Logger._logger.addHandler(stream_handler)

    @staticmethod
    def log_radio_data(radio_data, rssi):
        id = radio_data.get("id", "Missing ID")
        temp = radio_data.get("temperature", "Missing Temperature")
        humidity = radio_data.get("humidity", "Missing Humidity")
        log_message = "Radio received... id: {0}, temp: {1}, RH: {2}, RSSI: {3}".format(id, temp, humidity, rssi)

        # Use the named logger instance to log the message
        Logger._logger.info(log_message)

    @staticmethod
    def error(msg):
        # Use the named logger instance to log the error
        Logger._logger.error(msg)

# Setup logger
Logger.setup()

# Sample usage
# Logger.log_radio_data({"id": "123", "temperature": "22.5", "humidity": "50.2"}, "-70dBm")
# Logger.error("Sample Error Message")
