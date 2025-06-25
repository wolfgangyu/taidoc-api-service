# 島嶼心晴 (TerraMare Heart) - 泰博 API 服務 (TaiDoc API Service)

This project is a standalone backend microservice built with Node.js and Express.js, fully containerized with Docker. It is dedicated to receiving and processing data from TaiDoc medical devices, serving as the primary data gateway for the "TerraMare Heart" health management platform.

---

## 台灣華語說明

### 簡介
本專案是一個獨立的後端微服務，採用 Node.js 與 Express.js 框架建置，並透過 Docker 進行容器化。它專門用於接收並處理來自泰博 (TaiDoc) 醫療裝置的數據，是「島嶼心晴」健康管理平台的核心數據入口。

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

### 請求格式
* **Content-Type**: `text/plain;charset=us-ascii`
* **Body**: `key=value` 格式，每行一組，以 `\r\n` 或 `\n` 分隔。

### 如何在本機運行
1.  **安裝依賴**: `npm install`
2.  **設定環境變數**: 複製 `.env.example` 為 `.env`，並填入您的 Supabase 金鑰。
3.  **啟動開發伺服器**: `npm run dev`

### 如何透過 Docker 部署
1.  **建置並啟動容器**: `docker compose up -d --build`
2.  **確認服務狀態**: `docker compose ps`

### 測試範例 (curl)
請將 `<YOUR_PUBLIC_URL>`替換為您部署後的公開網址。

**時間校正:**
```bash
curl -i -X POST <YOUR_PUBLIC_URL>/api/taidoc/timeSync \
  -H "Content-Type: text/plain;charset=us-ascii" \
  --data-binary $'DeviceType=3260\r\nDeviceID=DEVICE-FOR-SYNC-01\r\nExtensionID=0'
```

**上傳資料 (未綁定裝置):**
```bash
curl -i -X POST <YOUR_PUBLIC_URL>/api/taidoc/gateway \
  -H "Content-Type: text/plain;charset=us-ascii" \
  --data-binary $'GatewayID=GW-01\r\nDeviceType=85\r\nDeviceID=UNBOUND-DEVICE-01\r\nExtensionID=0\r\nDataType=7\r\nValue1=98\r\nYear=2025\r\nMonth=6\r\nDay=22'
```

---

## English Guide

### Introduction
This project is a standalone backend microservice built with Node.js and Express.js, containerized with Docker. It is designed to receive and process data from TaiDoc medical devices, serving as the core data gateway for the "TerraMare Heart" platform.

### API Endpoints
This service provides two primary API endpoints:

**Time Sync**
- **Method:** POST
- **URI:** /api/taidoc/timeSync
- **Function:** Allows TaiDoc devices to request the server time for synchronization.

**Data Upload**
- **Method:** POST
- **URI:** /api/taidoc/gateway
- **Function:** Receives physiological measurement data and supports an automatic binding flow for new devices.

### Request Format
- **Content-Type:** text/plain;charset=us-ascii
- **Body:** key=value format, with pairs separated by \r\n or \n.

### Running Locally
1. **Install Dependencies:** `npm install`
2. **Set Environment Variables:** Copy `.env.example` to `.env` and fill in your Supabase keys.
3. **Start Development Server:** `npm run dev`

### Deploying with Docker
1. **Build and Start Container:** `docker compose up -d --build`
2. **Check Service Status:** `docker compose ps`

### cURL Examples
Please replace <YOUR_PUBLIC_URL> with your deployed public URL.

**Time Sync:**
```bash
curl -i -X POST <YOUR_PUBLIC_URL>/api/taidoc/timeSync \
  -H "Content-Type: text/plain;charset=us-ascii" \
  --data-binary $'DeviceType=3260\r\nDeviceID=DEVICE-FOR-SYNC-01\r\nExtensionID=0'
```

**Data Upload (Unbound Device):**
```bash
curl -i -X POST <YOUR_PUBLIC_URL>/api/taidoc/gateway \
  -H "Content-Type: text/plain;charset=us-ascii" \
  --data-binary $'GatewayID=GW-01\r\nDeviceType=85\r\nDeviceID=UNBOUND-DEVICE-01\r\nExtensionID=0\r\nDataType=7\r\nValue1=98\r\nYear=2025\r\nMonth=6\r\nDay=22'
```

---

## License
This project is licensed under the MIT License. 
