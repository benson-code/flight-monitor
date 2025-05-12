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
      const res = await axios.get('http://localhost:3000/api/flights');
      setFlights(res.data.results);
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
                  <th>航線</th>
                  <th>當前票數</th>
                  <th>變化</th>
                  <th>更新時間</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(({ origin, destination, count, prev, delta, timestamp }, idx) => (
                  <tr key={idx}>
                    <td>{origin}→{destination}</td>
                    <td>{count}</td>
                    <td className={delta < 0 ? 'decrease' : 'increase'}>
                      {delta < 0 ? '↓' : '↑'} {Math.abs(delta)}
                    </td>
                    <td>{timestamp ? new Date(timestamp).toLocaleString('zh-TW', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : ''}</td>
                  </tr>
                ))}
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
