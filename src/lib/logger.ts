// src/lib/logger.ts
import pino from 'pino';

// 定義 pino 的設定選項
const pinoOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
};

// 只有在非 'production' 環境下 (例如在本機 'development' 環境)，
// 我們才使用 pino-pretty 來美化輸出。
if (process.env.NODE_ENV !== 'production') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  };
}

const logger = pino(pinoOptions);

export default logger;