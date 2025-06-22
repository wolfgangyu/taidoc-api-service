import dotenv from 'dotenv';

// 確保在所有其他 import 之前，最先載入環境變數
// This MUST be the first line of code to run.
dotenv.config();

import express from 'express';
import logger from './lib/logger';
import { handleGetDateTimeRequest } from './routes/getDateTime';
import { handleAddNewDataRequest } from './routes/addNewData';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse text/plain format - allow both TaiDoc spec and broader text/plain
app.use(express.text({ type: ['text/plain;charset=us-ascii', 'text/plain'], limit: '2mb' }));

// Health check route
app.get('/', (req, res) => {
  res.send('TerraMare Heart - TaiDoc API Service is running!');
});

// === NEW DEDICATED ROUTES ===
app.post('/api/taidoc/timeSync', handleGetDateTimeRequest);
app.post('/api/taidoc/gateway', handleAddNewDataRequest);

// Only start the server if this is the main module (not when imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`TaiDoc API service running on port ${PORT}`);
  });
}

export default app; // Export for testing purposes