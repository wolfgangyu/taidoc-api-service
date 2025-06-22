import { jest, beforeEach } from '@jest/globals';
import { resetDb } from '../__mocks__/inMemoryDb';

// Reset mocks and database before each test
beforeEach(() => {
  jest.clearAllMocks();
  resetDb();
});

// Set up environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_KEY = 'test-key'; 