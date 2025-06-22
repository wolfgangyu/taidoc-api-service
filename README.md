# 島嶼心晴 (TerraMare Heart) - 泰博 API 服務 (TaiDoc API Service)

This project is a standalone backend microservice dedicated to receiving and processing data from TaiDoc medical devices.

---

## 台灣華語說明

### 簡介
本專案是一個獨立的後端微服務，採用 Node.js 與 Express.js 框架建置，並透過 Docker 進行容器化，可輕鬆部署於任何支援 Docker 的環境，專門用於接收並處理來自泰博 (TaiDoc) 醫療裝置的數據。

### API 端點 (Endpoints)
本服務提供兩個主要的 API 端點：

1.  **時間校正 (Time Sync)**
    * **方法**: `POST`
    * **URI**: `/api/taidoc/timeSync`
    * **功能**: 供泰博裝置請求伺服器時間以進行校時。

2.  **資料上傳 (Data Upload)**
    * **方法**: `POST`
    * **URI**: `/api/taidoc/gateway`
    * **功能**: 接收來自泰博裝置的生理量測數據，並支援新裝置的自動綁定流程。

### 如何在本機運行
1.  **安裝依賴**: `npm install`
2.  **設定環境變數**: 複製 `.env.example` 為 `.env`，並填入您的 Supabase 金鑰。
3.  **啟動開發伺服器**: `npm run dev`

### 如何透過 Docker 部署
1.  **建置並啟動容器**: `docker compose up -d --build`
2.  **確認服務狀態**: `docker compose ps`

---

## English Guide

### Introduction
This project is a standalone backend microservice built with Node.js and Express.js. It is containerized using Docker for easy deployment in any Docker-supported environment, specifically designed to receive and process data from TaiDoc medical devices.

### API Endpoints
This service provides two primary API endpoints:

1.  **Time Sync**
    * **Method**: `POST`
    * **URI**: `/api/taidoc/timeSync`
    * **Function**: Allows TaiDoc devices to request the server time for synchronization.

2.  **Data Upload**
    * **Method**: `POST`
    * **URI**: `/api/taidoc/gateway`
    * **Function**: Receives physiological measurement data from TaiDoc devices and supports an automatic binding flow for new devices.

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
