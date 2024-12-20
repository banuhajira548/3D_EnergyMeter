export const API_BASE_URL = 'http://172.18.7.93:9898';

export const endpoints = {
  sensorData: (machineId) => `${API_BASE_URL}/sensor_data/${machineId}`,
  machineNames: {
    1: "Mazak H 500",
    2: "LT 500"
  }
};
