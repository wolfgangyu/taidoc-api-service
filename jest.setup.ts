import { resetDb } from './src/__mocks__/inMemoryDb';
import { resetMocks } from './src/__mocks__/supabaseClient';

// This line forces Jest to always use our mock implementation for the admin client
jest.mock('./src/lib/supabaseAdmin', () => require('./src/__mocks__/supabaseClient'));

// This runs before each test in every test file
beforeEach(() => {
  jest.clearAllMocks();
  resetDb();
  resetMocks();
}); 