import logging
import os

class Logger:

    # Create a named logger instance
    _logger = logging.getLogger('my_application')

    # Filter to only log INFO level events to the file
    class InfoFilter(logging.Filter):
        def filter(self, record):
            return record.levelno == logging.INFO

    @staticmethod
    def shutdown():
        logging.shutdown()

    @staticmethod
    def setup():
        # Clear any previously added handlers
        Logger._logger.handlers = []

        # Set the logging level
        Logger._logger.setLevel(logging.DEBUG)

        # Go up one level to get to `python_radio`
        log_directory = os.path.expanduser('~/Desktop')
        # Create handlers
        file_handler = logging.FileHandler(os.path.join(log_directory, "radio_data.log"), mode='a')
        stream_handler = logging.StreamHandler()

        # Add the InfoFilter to the file handler so only INFO logs are written
        file_handler.addFilter(Logger.InfoFilter())

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
    def log_radio_data(radio_data):
        id = radio_data.get("id", "N/A")
        # Check if the value exists and round to 2 decimal places, else assign "N/A"
        temp = round(float(radio_data["temperature"]), 2) if "temperature" in radio_data else "N/A"
        humidity = round(float(radio_data["humidity"]), 2) if "humidity" in radio_data else "N/A"
        voltage = round(float(radio_data["voltage"]), 2) if "voltage" in radio_data else "N/A"
        rssi = round(float(radio_data["rssi"]), 2) if "rssi" in radio_data else "N/A"
        log_message = "id: {0}, temp: {1}, RH: {2}, voltage: {3}, RSSI: {4}".format(id, temp, humidity, voltage, rssi)

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
