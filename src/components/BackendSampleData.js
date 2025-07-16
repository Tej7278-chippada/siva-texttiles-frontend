// src/components/BackendSampleData.js
import React, { useEffect, useState } from 'react';
import { fetchBackendData } from './Apis/UserApis';

const BackendSampleData = () => {
  const [backendData, setBackendData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getBackendData = async () => {
      try {
        const response = await fetchBackendData();
        setBackendData(response.data);
      } catch (err) {
        setError('Error fetching backend data.');
      } finally {
        setLoading(false);
      }
    };

    getBackendData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Backend Data:</h2>
      <p>{backendData}</p>
    </div>
  );
};

export default BackendSampleData;
