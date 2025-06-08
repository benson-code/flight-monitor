import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState('');

  // 定義 fetchData 在 useEffect 之前
  const fetchData = async () => {
    setLoading(true);
    setError('');
    setLastFetchTime(new Date().toLocaleString());
    try {
      const res = await axios.get('https://api.aviationstack.com/v1/flights', {
        params: {
          access_key: 'c0b127d00f929b9052609cdeded794e1',
          flight_status: 'active'
        }
      });
      setFlights(res.data.data || []);
    } catch (err) {
      setError(`錯誤：${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tracking Flight Monitor</h1>
      </header>
      <main className="app-content">
        {loading ? (
          <p>讀取中…</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <table className="flight-table">
              <thead>
                <tr>
                  <th>航班號</th>
                  <th>出發地</th>
                  <th>目的地</th>
                  <th>狀態</th>
                  <th>預計起飛</th>
                  <th>預計到達</th>
                </tr>
              </thead>
              <tbody>
                {flights.slice(0, 20).map((flight, idx) => {
                  const departure = flight.departure || {};
                  const arrival = flight.arrival || {};
                  return (
                    <tr key={idx}>
                      <td>{flight.flight?.iata || 'N/A'}</td>
                      <td>{departure.airport || 'N/A'} ({departure.iata || 'N/A'})</td>
                      <td>{arrival.airport || 'N/A'} ({arrival.iata || 'N/A'})</td>
                      <td>{flight.flight_status || 'N/A'}</td>
                      <td>{departure.estimated ? new Date(departure.estimated).toLocaleString('zh-TW') : 'N/A'}</td>
                      <td>{arrival.estimated ? new Date(arrival.estimated).toLocaleString('zh-TW') : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="last-update">{lastFetchTime}</p>
          </>
        )}
        <button onClick={fetchData} disabled={loading}>
          {loading ? '正在刷新...' : '手動刷新'}
        </button>
      </main>
    </div>
  );
}

export default App
