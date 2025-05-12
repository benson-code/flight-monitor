const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 允許跨域請求 (CORS)
app.use((req, res, next) => { res.header("Access-Control-Allow-Origin", "*"); next(); });

// AviationStack API Key
const API_KEY = 'c0b127d00f929b9052609cdeded794e1';
// 要檢測的航線
const routes = [
  { origin: 'TPE', destination: 'SFO' }
];

// 紀錄上一次的航班數量
let previousCounts = {};

// 紀錄最後一次的檢測結果
let lastResults = [];

// 檢測航班剩餘票數
async function checkFlights() {
  const timestamp = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log(`[${timestamp}] format: ${timestamp}`);
  console.log(`[${timestamp}] 開始檢測航班`);
  const newResults = [];
  for (const { origin, destination } of routes) {
    try {
      const res = await axios.get('http://api.aviationstack.com/v1/flights', {
        params: {
          access_key: 'c0b127d00f929b9052609cdeded794e1',
          dep_iata: origin,
          arr_iata: destination,
        },
      });
      const flights = res.data.data || [];
      const count = flights.length;
      const key = `${origin}_${destination}`;
      const prev = previousCounts[key] !== undefined ? previousCounts[key] : count;
      if (count < prev) {
        console.warn(`⚠️ [${timestamp}] ${origin}->${destination} 機票數量由 ${prev} 減少至 ${count}`);
      } else {
        console.log(`[${timestamp}] ${origin}->${destination} 機票數量：${count}`);
      }
      previousCounts[key] = count;
      newResults.push({ 
        origin, 
        destination, 
        count, 
        prev, 
        delta: count - prev, 
        timestamp: timestamp
      });
    } catch (err) {
      console.error(`❌ [${timestamp}] ${origin}->${destination} 檢測錯誤：`, err.message);
    }
  }
  lastResults = newResults;
}

// 每小時整點執行一次
cron.schedule('0 * * * *', checkFlights);
// 啟動時立即執行一次
checkFlights();

// 提供 API 端點（每次請求前重新檢測）
app.get('/api/flights', async (req, res) => {
  console.log('[API] Incoming request to /api/flights');
  try {
    console.log('[API] Starting checkFlights...');
    await checkFlights();
    console.log('[API] checkFlights completed');
    res.json({ results: lastResults });
  } catch (err) {
    console.error('[API] Error:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: '無法更新航班資料' });
  }
});

// 啟動 Express server
app.listen(port, () => console.log(`API server listening at http://localhost:${port}`));
