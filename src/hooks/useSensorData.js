import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../Components/apiEndpoints';

export const useSensorData = (machineId) => {
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sensor_data/${machineId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSensorData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    fetchData(); // Initial fetch

    return () => clearInterval(interval);
  }, [machineId]);

  return { sensorData, error, loading };
}; 