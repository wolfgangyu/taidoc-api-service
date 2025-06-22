# STAGE 1: Builder - 安裝所有依賴套件並建置應用程式
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 複製 package.json 和 lock 檔案
COPY package*.json ./

# 使用 npm ci 來進行可靠且快速的安裝
RUN npm ci

# 複製所有應用程式原始碼
COPY . .

# 執行 TypeScript 編譯
RUN npm run build

# ---

# STAGE 2: Runner - 建立最終的、輕量化的正式環境映像檔
FROM node:18-alpine
WORKDIR /usr/src/app

# 只複製 package.json 以便安裝正式環境的依賴
COPY package*.json ./
# 只安裝 production 依賴，保持映像檔小巧
RUN npm ci --production

# 核心修正：從 builder 階段，將編譯好的 dist 資料夾複製過來
COPY --from=builder /usr/src/app/dist ./dist

# (可選，但建議) 為了安全性，建立一個非 root 使用者來運行程式
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 開放容器的 3000 port
EXPOSE 3000

# 容器啟動時執行的指令
CMD [ "node", "dist/index.js" ]