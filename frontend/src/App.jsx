import React, { useState, useCallback } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const API_BASE_URL = 'https://api.aviationstack.com/v1';

// Helper functions
const formatDateTime = (dateStr) => {
  if (!dateStr) return '時間未定';
  try {
    // API 回傳的時間已是當地時間，但時區標記錯誤 (UTC)。
    // 為了直接顯示該時間而不進行轉換，我們強制以 UTC 時區來格式化。
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };
    return new Date(dateStr).toLocaleString('zh-TW', options);
  } catch {
    return '時間格式錯誤';
  }
};

const getAirlineName = (airline) => {
  const airlineMap = {
    'EVA': '長榮航空', 'BR': '長榮航空',
    'CI': '中華航空', 'CAL': '中華航空',
    'JX': '星宇航空', 'STARLUX': '星宇航空'
  };
  return airlineMap[airline?.iata || airline?.icao] || airline?.name || '未知航空';
};


const getStatusClass = (status) => {
  const classMap = {
    'active': 'active',
    'scheduled': 'scheduled',
    'delayed': 'delayed',
    'cancelled': 'cancelled',
    'landed': 'landed',
    'diverted': 'diverted',
    'incident': 'incident',
  };
  return classMap[status?.toLowerCase()] || 'unknown';
};

const FlightCard = ({ flight }) => {
  if (!flight) return null;

  const status = flight.flight_status || 'unknown';
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
  const statusClass = getStatusClass(flight.flight_status);
  const airlineName = getAirlineName(flight.airline);
  const flightNumber = flight.flight?.iata || flight.flight?.icao || '未知航班';

  return (
    <li className="flight-card" tabIndex="0">
      <div className="flight-header">
        <span className="material-icons">flight</span>
        <span>{`${flightNumber} ${airlineName}`}</span>
      </div>
      <div className="flight-info">
        出發時間: {formatDateTime(flight.departure?.scheduled)}<br />
        抵達時間: {formatDateTime(flight.arrival?.scheduled)}<br />
        登機門: {flight.departure?.gate || '待定'}
        {flight.departure?.delay && <><br />延誤: {Math.floor(flight.departure.delay / 60)} 分鐘</>}
      </div>
      <div className={`status ${statusClass}`} aria-label={`Flight Status: ${displayStatus}`}>{displayStatus}</div>
    </li>
  );
};

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError('');
    setInitialLoad(false);
    try {
            if (!API_KEY) {
        throw new Error('API 金鑰未設定，請在 .env 檔案中設定 VITE_AVIATIONSTACK_API_KEY');
      }
      const response = await fetch(`${API_BASE_URL}/flights?access_key=${API_KEY}&dep_iata=TPE&arr_iata=LAX&limit=100`);
      if (!response.ok) throw new Error('API 請求失敗');
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || '無法取得航班資料');
      }
      
      const filteredFlights = (data.data || []).filter(flight => 
        flight.departure?.iata === 'TPE' && 
        flight.arrival?.iata === 'LAX'
      );
      setFlights(filteredFlights);

    } catch (err) {
      const errorMessage = err.message === 'Failed to fetch' ? 'API 連線失敗，請確認網路連線' : err.message;
      setError(errorMessage);
      console.error('獲取航班資訊時發生錯誤:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (initialLoad) {
        return <div className="loading">請按下方按鈕以載入航班資訊</div>;
    }
    if (loading) {
      return <div className="loading">正在載入航班資訊...</div>;
    }
    if (error) {
      return <div className="loading">錯誤：{error}</div>;
    }
    if (flights.length === 0) {
      return <div className="loading">目前沒有 TPE 到 LAX 的航班</div>;
    }
    return flights.map((flight, index) => <FlightCard key={flight.flight?.iata || index} flight={flight} />);
  };

  return (
    <div className="app-container">
      <header className="app-header">桃園至洛杉磯國際機場即時航班資訊</header>
      <ul className="flight-list" role="list">
        {renderContent()}
      </ul>
      <button onClick={fetchFlights} disabled={loading} className="update-button">
        {loading ? '更新中...' : '更新航班資訊'}
      </button>
    </div>
  );
}

export default App;
