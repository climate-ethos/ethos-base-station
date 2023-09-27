# Ethos Raspberry Pi

This repository stores the code which is run on the Raspberry Pi for the Ethos in home system trial.

## Contents

- [Ethos Raspberry Pi](#ethos-raspberry-pi)
  - [Contents](#contents)
  - [Tips](#tips)
    - [Show settings button](#show-settings-button)
  - [Installation and building](#installation-and-building)
    - [Development build](#development-build)
    - [Production build](#production-build)
  - [Testing](#testing)
    - [Unit testing](#unit-testing)
    - [End-to-end testing](#end-to-end-testing)
  - [Application data structure](#application-data-structure)
    - [Data flow diagram](#data-flow-diagram)
    - [Database types](#database-types)
      - [Sensor](#sensor)
      - [Weather](#weather)
      - [Preferences](#preferences)
      - [Survey](#survey)
      - [Alert](#alert)
    - [Pinia store types](#pinia-store-types)
      - [Database store](#database-store)
      - [Data Preferences store](#data-preferences-store)
      - [Data Sensor store](#data-sensor-store)
      - [Data User store](#data-user-store)
      - [Date Time store](#date-time-store)
      - [Keyboard store](#keyboard-store)
      - [Socket store](#socket-store)
      - [Survey store](#survey-store)
      - [Volume store](#volume-store)
      - [Weather store](#weather-store)

## Tips

### Show settings button

To show the settings button, press the ethos logo (top left) 7 times in quick succession.

## Installation and building

### Development build

Requirements: _NPM, Yarn, Python 3.9 (with venv) and Docker_

1. Ensure Docker is open and running.
2. Under `./javascript_ui` make a file named `.env` using the provided `.env.example` file and fill in all variables.
3. Run install script `sh dev_install.sh` (Mac/Linux) or `.\dev_install.bat` (Windows).
4. To run development build run `sh dev_run.sh` (Mac/Linux) or `.\dev_run.bat` (Windows).
5. For testing, configure a User with ID of `999` and a password of `12345`

Note: If you get an error `CouchDB did not start in time` or `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`, make sure docker is running, either by launching the application or by running `sudo systemctl start docker` (Linux).

### Production build

Requirements: _NPM, Yarn, Python 3.9 (with venv) and Git_

1. Image Raspberry Pi OS to an SD card using [Raspberry Pi Imager](https://www.raspberrypi.com/software/). When setting up the user ensure the name is set to `pi`. _This is important for automatic process startup with systemd_
2. Ensure that existing packages are up to date with `sudo apt update && sudo apt -y upgrade`
3. (If required) Setup waveshare touchscreen divers by following [these instructions](<https://www.waveshare.com/wiki/8inch_DSI_LCD_(C)#Software_Setting>)
4. Install nvm by using: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`
5. Source terminal with `source ~/.bashrc`
6. Install node version 18 with `nvm install 18` and then activate it with `nvm use 18`
7. Install Yarn with `npm install --global yarn`
8. Ensure that Python is installed with `python3 --version`, and if not install it
9. Navigate to the home directory with either `cd ~` or `cd /home/pi`
10. Clone the GitHub repository with `git clone git@github.com:climate-ethos/ethos-raspberry-pi.git`
11. Move into the newly created directory with `cd ethos-raspberry-pi`
12. Under `./javascript_ui` make a file named `.env` using the provided `.env.example` file and fill in all variables.
13. Make all pi-related scripts executable with the command: `find . -maxdepth 1 -type f -name "pi_*.sh" -exec chmod +x {} \;`
14. Install dependencies by running `sh pi_install.sh` (Pi). This will also setup auto-launch at startup and automatic updates with a cron job.
15. Build production binary/Electron app using `sh pi_build.sh`
16. Run systemd services with `sh pi_run.sh` (Pi), or alternatively restart device.

If this doesn't work you can try a manual launch with `pi_run_manual.sh` (Pi) for debugging.

**Important:** Ensure that the application is cloned in the home directory (`~/ethos-raspberry-pi`). Otherwise systemd services will not work. The system has been designed with Python 3.9 and Node 18 so if any errors arise check the versions of those two services first.

## Testing

### Unit testing

Requirements: _NPM, Yarn and Python 3.9 (with venv)_

1. Run executable with `sh dev_tests_unit.sh` (Mac/Linux)

### End-to-end testing

Requirements: _NPM, Yarn, Python 3.9 (with venv) and Docker_

1. Run executable with `sh dev_tests_e2e.sh` (Mac/Linux).

## Application data structure

### Data flow diagram

![ethos-data-flow](./assets/ethos-data-flow.svg)

Each data type shown in the diagram is explained below:

### Database types

Definitions for the structure can be found in `javascript_ui/src/typings/database-types.d.ts`. The database is used to store historical data which may be useful for research purposes. Each row in the database corresponds to a historical record of one of the following types:

#### Sensor

```{ .json }
{
  type: 'sensor';
  time: Date;
  userId: string;
  sensorLocation: string | undefined;
  sensorId: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
  coreTemperature: number | undefined;
}
```

#### Weather

```{ .json }
{
  type: 'weather';
  time: Date;
  userId: string;
  weatherLocation: string | null;
  temperature: number | null;
  humidity: number | null;
}
```

#### Preferences

```{ .json }
{
  type: 'preferences';
  time: Date;
  userId: string;
  audioType: AudioType;
  isFollowUp: boolean;
  coolingStrategyOptions: Array<{
    key: string;
    haveAccessTo: boolean;
    wouldUse: boolean;
    whyNotUse: Array<string>;
    whyNotUseOther: string;
  }>;
}
```

#### Survey

```{ .json }
{
  type: 'survey';
  time: Date;
  userId: string;
  wasHome: undefined | boolean;
  coolingStrategiesUsed: Array<string>;
  howEffective: undefined | number;
}
```

#### Alert

```{ .json }
{
  type: 'alert';
  time: Date;
  userId: string;
  riskLevel: RiskLevel | undefined;
  volumePercent: number;
  dismissMethod: null | 'not here' | 'cooling strategies' | 'dismiss';
}
```

### Pinia store types

This is the structure of the state which is stored in the pinia store. The pinia store is used for live data which directly affects the UI or application logic.

#### Database store

The database store is designed to provide centralized access and actions related to a PouchDB database and its replication to a CouchDB instance.

- `db`: Holds the instance of the PouchDB local database.

- `replicationHandler`: Holds the replication handler instance, which is responsible for replicating the PouchDB instance to a remote CouchDB database.

- `replicationStatus`: Provides the current status of the replication process. Can be one of the following values:
  - `initial`
  - `active`
  - `paused`
  - `denied`
  - `complete`
  - `error`

#### Data Preferences store

The Data Preferences store manages user preferences related to audio types, follow-up settings, and cooling strategy options.

- `audioType`: Specifies the type of audio that will be used. It can be one of the enumerated values from `AudioType` (e.g., `AudioType.TONE`).

- `isFollowUp`: A boolean flag to indicate if the user wishes to follow up with a focus group discussion.

- `coolingStrategyOptions`: An array of objects representing the various cooling strategies. Each object contains a key, which is the identifier for the strategy, and several other options like `haveAccessTo` and `wouldUse`.

  The `coolingStrategyOptions` array is generated dynamically based on keys from the `coolingStrategies` helper, and each strategy option object is set to default values as defined in `defaultOptions`.

#### Data Sensor store

The Data Sensor store is designed to manage sensor data, including alert states and other sensor-related metrics.

- `alertSensor`: Holds the sensor data for the current alert. It is of type `SensorData` which includes fields like `id`, `name`, `temperature`, etc.

- `allSensorData`: An array that contains objects of type `SensorData`. Each object holds information about a sensor including its `id`, `name`, `temperature`, `humidity`, `lastSeen`, `coreTemperature`, and `riskLevel`.
  - `id`: Sensor identification number.
  - `name`: Sensor name (in this case where it is located).
  - `temperature`: Current temperature data from the sensor (in degrees Celsius).
  - `humidity`: Current humidity data from the sensor (relative humidity).
  - `lastSeen`: The most recent time the sensor was active.
  - `coreTemperature`: Calculated core temperature, using the JOS-3 model.
  - `riskLevel`: Calculated risk level based on core temperature.

The `allSensorData` array is initialized with four sensor objects, each having their fields set to `undefined`.

#### Data User store

The Data User store is designed to manage user-related data, such as geographic location, biometric details, and sex. This is used for calculating core temperature.

- `id`: Holds the ID of the user which is used to connect to the database and store info
- `password`: Stores the password for the associated user ID to connect tot the database
- `postcode`: Holds the postcode of the user.

- `latitude`: Holds the latitude coordinate corresponding to the user's postcode.

- `longitude`: Holds the longitude coordinate corresponding to the user's postcode.

- `ageYears`: Holds the age of the user in years.

- `heightCm`: Holds the height of the user in centimetres.

- `weightKg`: Holds the weight of the user in kilograms.

- `sex`: Holds the sex of the user. Can be either: 'female', 'male' or 'other'.

#### Date Time store

The Date Time store is designed to manage date and time-related data. It updates this data periodically.

- `currentDate`: Holds the current date and time as a JavaScript `Date` object.

#### Keyboard store

The Keyboard store is designed to manage the virtual keyboard behavior and settings in the application. This includes what input the keyboard is bound to, its current value, type, and dimensions.

- `keyboardBinding`: Holds the HTMLInputElement that the keyboard is currently bound to. Used to refocus the input. Can be either `undefined` or an instance of `HTMLInputElement`.

- `keyboardValue`: Holds the value to which the keyboard is currently bound. Can be either `undefined` or an object with a `value` property of type `string`.

- `keyboardType`: Specifies the type of the keyboard. Can be either `'text'` or `'number'`.

- `keyboardHeight`: Holds the height of the keyboard in pixels. Can be either `undefined` or a `number`.

#### Socket store

The Socket store is designed to manage the real-time communication between the client and the server using Socket.io. This includes tracking the state of the connection and the socket instance itself.

- `isConnected`: A boolean flag that indicates whether the socket connection is currently established. Defaults to `false`.

- `socket`: Holds the instance of the Socket.io client connected to the server. This is the socket that is responsible for emitting and listening to real-time events. Can be either `null` or an instance of `Socket<ServerToClientEvents, ClientToServerEvents>`.

#### Survey store

The Survey store is designed to manage the user survey data and logic. This includes tracking the number of alerts that have occurred since the last survey, storing the user's answers to the survey questions, and determining whether the survey modal should be displayed.

- `alertsSinceLastSurvey`: An integer that keeps track of the number of alerts that have occurred since the last survey was displayed. Starts from 0.

- `alertsInLastTimePeriod`: An integer that holds the number of alerts that have occurred in the last specified time period. This is used to display the number of alerts to the user when showing the survey.

- `isShowSurveyModal`: A boolean flag that indicates whether the survey modal should be shown. Defaults to `false`.

- `surveyAnswers`: An object that holds the user's answers to the survey questions. It follows the structure of `SurveyDatabaseStructure`, and includes:
  - `wasHome`: Can be either `undefined` or a boolean indicating whether the user was home.
  - `coolingStrategiesUsed`: An array that stores the cooling strategies used by the user.
  - `howEffective`: Can be either `undefined` or a value indicating how effective the cooling strategies were.

#### Volume store

The Volume store is designed to manage the volume settings in the application. This includes tracking the current volume value and providing the capability to increase or decrease it.

- `volumeValue`: An integer that holds the current value of the volume. This value is bounded between 0 and `maxVolume` (5 by default).

#### Weather store

The Weather store is designed to manage the weather-related data and forecast for the user. It provides functionalities like fetching current weather conditions and detailed forecasts based on the user's latitude and longitude.

- `isShowDetailedForecast`: A boolean value indicating whether to show the detailed forecast modal or not.

- `errorMessage`: A string that holds any error message generated during the data fetching process. Initially set to 'Updating data...'.

- `stationName`: A string or null that holds the name of the weather station from where the weather data is fetched.

- `currentTemp`: A number or null that holds the current temperature in metric units.

- `currentHumidity`: A number or null that holds the current humidity level.

- `weatherDescription`: A string or undefined that holds a textual description of the current weather conditions, e.g., "clear sky".

- `weatherIconId`: A string or null that holds the icon ID for the current weather conditions. This ID is used to display the corresponding weather icon.

- `forecastTemps`: An array of objects or null that holds the detailed forecast data. Each object contains the `date` (as a JavaScript Date object) and the `temperature` (as a number in metric units).

- `pollInterval`: A number or null that specifies the current interval to update weather
