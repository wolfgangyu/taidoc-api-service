# 島嶼心晴 (TerraMare Heart) - 泰博 API 服務 (TaiDoc API Service)

This project is a standalone backend microservice dedicated to receiving and processing data from TaiDoc medical devices. It is built with Node.js and Express.js, fully containerized with Docker, and engineered for high reliability and security.

---

## 繁體中文說明

### 系統架構
本專案是一個獨立的後端微服務，其核心職責是作為「島嶼心晴」健康管理平台與泰博 (TaiDoc) 硬體裝置之間的數據閘道。它採用「裝置為中心 (Device-Centric)」的架構，所有數據上傳的授權，都基於一個在平台內預先建立的「裝置綁定」關係。

### API 端點 (Endpoints)
本服務提供兩個獨立的 API 端點：

1.  **時間校正 (Time Sync)**
    * **方法**: `POST`
    * **URI**: `/api/taidoc/timeSync`
    * **功能**: 供裝置請求伺服器時間以進行校時。此端點也會更新裝置的 `last_seen_at` 紀錄。

2.  **資料上傳 (Data Upload)**
    * **方法**: `POST`
    * **URI**: `/api/taidoc/gateway`
    * **功能**: 接收生理量測數據。**此端點會嚴格驗證裝置是否已綁定使用者**。若裝置未綁定，將回傳 `2002` 錯誤碼，且不會儲存任何量測資料。

### 如何在本機運行
1.  **安裝依賴**: `npm install`
2.  **設定環境變數**: 複製 `.env.example` 為 `.env`，並填入您的 Supabase 金鑰。
3.  **啟動開發伺服器**: `npm run dev`

### 如何透過 Docker 部署
1.  **建置並啟動容器**: `docker compose up -d --build`
2.  **確認服務狀態**: `docker compose ps`

---

## English Guide

### Architecture
This project is a standalone backend microservice that serves as the data gateway between the "TerraMare Heart" health platform and TaiDoc medical hardware. It employs a "device-centric" architecture where authorization for data uploads is based on a pre-existing device-to-patient binding relationship established within the platform.

### API Endpoints
This service provides two primary API endpoints:

1.  **Time Sync**
    * **Method**: `POST`
    * **URI**: `/api/taidoc/timeSync`
    * **Function**: Allows devices to request the server time for synchronization. This endpoint also updates the device's `last_seen_at` record.

2.  **Data Upload**
    * **Method**: `POST`
    * **URI**: `/api/taidoc/gateway`
    * **Function**: Receives physiological measurement data. **This endpoint strictly validates that the device has been bound to a user.** Unbound devices will receive a `2002` error code, and no measurement data will be saved.

### Running Locally
1.  **Install Dependencies**: `npm install`
2.  **Set Environment Variables**: Copy `.env.example` to `.env` and fill in your Supabase keys.
3.  **Start Development Server**: `npm run dev`

### Deploying with Docker
1.  **Build and Start Container**: `docker compose up -d --build`
2.  **Check Service Status**: `docker compose ps`

---

## License
This project is licensed under the MIT License.