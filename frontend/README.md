# 航班監控系統 (Flight Monitor)

這是一個使用 React 和 Vite 建構的航班監控系統前端應用程式，提供即時的航班資訊查詢功能。

## 功能特點

- 即時航班狀態查詢
- 航班追蹤與監控
- 響應式設計，支援各種裝置
- 簡潔直觀的使用者介面

## 技術棧

- React 19
- Vite 4.x
- React Router (用於頁面導航)
- Axios (用於 API 請求)
- Tailwind CSS (用於樣式設計)

## 快速開始

### 必要條件

- Node.js 16.14.0 或更高版本
- npm 或 yarn 套件管理工具

### 安裝步驟

1. 複製儲存庫
   ```bash
   git clone https://github.com/benson-code/flight-monitor.git
   cd flight-monitor/frontend
   ```

2. 安裝依賴套件
   ```bash
   npm install
   # 或
   yarn
   ```

3. 設定環境變數
   複製 `.env.example` 檔案並重新命名為 `.env`，然後填入您的 API 金鑰：
   ```
   VITE_AVIATIONSTACK_API_KEY=your_api_key_here
   ```

4. 啟動開發伺服器
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. 開啟瀏覽器並訪問 [http://localhost:5173](http://localhost:5173)

## 專案結構

```
frontend/
├── public/             # 靜態檔案
├── src/                 # 原始碼
│   ├── assets/          # 靜態資源 (圖片、字體等)
│   ├── components/      # 可重用的 UI 組件
│   ├── pages/           # 頁面組件
│   ├── services/        # API 服務
│   ├── App.jsx          # 主應用程式組件
│   └── main.jsx         # 應用程式入口點
├── .env.example         # 環境變數範例
├── .gitignore           # Git 忽略設定
├── package.json         # 專案設定與依賴
├── vite.config.js       # Vite 設定
└── README.md            # 專案說明文件
```

## 環境變數

專案使用以下環境變數：

| 變數名稱 | 描述 | 必填 | 預設值 |
|----------|------|------|--------|
| `VITE_AVIATIONSTACK_API_KEY` | AviationStack API 金鑰 | 是 | 無 |

## 開發

### 程式碼風格

專案使用 ESLint 和 Prettier 來保持程式碼風格一致。

```bash
# 檢查程式碼風格
npm run lint

# 自動修復可修復的風格問題
npm run lint:fix
```

### 建置生產版本

```bash
npm run build
```

建置後的檔案會存放在 `dist` 目錄中。

## 授權

[MIT](LICENSE)

## 貢獻

歡迎提交 Pull Request 或回報問題。
