import {
  vi,
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  MockedFunction,
} from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useDataSensorStore } from 'src/stores/dataSensor';
import { SocketSensorData } from 'src/typings/data-types';

// Mock socket IO
import { io, Socket } from 'socket.io-client';
import { useSocketStore } from 'src/stores/socket';
vi.mock('socket.io-client', () => {
  return {
    io: vi.fn().mockReturnValue({
      on: vi.fn(),
      emit: vi.fn(),
    }),
  };
});

function getMockedCallback(socket: Socket, eventName: string) {
  const onMock = socket.on as unknown as MockedFunction<typeof socket.on>;
  const callback = onMock.mock.calls.find(([event]) => event === eventName);
  return callback ? callback[1] : null;
}

function invokeEventCallback(
  socket: Socket,
  eventName: string,
  eventData?: SocketSensorData
) {
  const callback = getMockedCallback(socket, eventName);
  if (typeof callback === 'function') {
    if (eventData) {
      callback(eventData);
    } else {
      callback();
    }
  } else {
    throw new Error(`${eventName} callback is not a function or is undefined`);
  }
}

describe('Data Sensor Store', () => {
  let dataSensorStore: ReturnType<typeof useDataSensorStore>;
  let socketStore: ReturnType<typeof useSocketStore>;
  const socket = io();

  beforeEach(() => {
    // Define store
    const testPinia = createPinia();
    setActivePinia(testPinia);
    dataSensorStore = useDataSensorStore();
    socketStore = useSocketStore();
    dataSensorStore.setup();
  });

  afterEach(() => {
    // Reset store
    setActivePinia(undefined);
    dataSensorStore.$reset();
    // Clear mocks
    vi.clearAllMocks();
  });

  it('should set isConnected to true on socket connect', () => {
    // Make sure is connected is false
    socketStore.isConnected = false;
    invokeEventCallback(socket, 'connect');
    expect(socketStore.isConnected).toBe(true);
  });

  it('should set isConnected to false on socket disconnect', () => {
    // Make sure is connected is true
    socketStore.isConnected = true;
    invokeEventCallback(socket, 'disconnect');
    expect(socketStore.isConnected).toBe(false);
  });

  it('should handle socket "data" event and update sensor data', () => {
    // Set first sensor with id of 1
    dataSensorStore.allSensorData[0].id = 1;
    // Define Mock Data
    const mockData: SocketSensorData = {
      id: '1',
      temperature: '20',
      humidity: '60',
    };
    invokeEventCallback(socket, 'data', mockData);
    // Find sensor and check data is correctly set
    const sensor = dataSensorStore.allSensorData.find(
      (dataSensor) => dataSensor.id == 1
    );
    expect(sensor).toBeDefined();
    if (sensor) {
      expect(sensor.temperature).toBe(20);
      expect(sensor.humidity).toBe(60);
    }
  });
});
