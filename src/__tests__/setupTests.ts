import { createClient } from '@supabase/supabase-js';
import { resetDb } from '../__mocks__/inMemoryDb';
import { resetMocks, supabaseAdmin as mockSupabaseAdmin } from '../__mocks__/supabaseClient';

// Load environment variables
require('dotenv').config();

// Create a mock Supabase client for testing
const mockSupabase = createClient(
  'https://mock-project.supabase.co',
  'mock-anon-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Mock the supabaseAdmin module
jest.mock('../lib/supabaseAdmin', () => ({
  supabaseAdmin: mockSupabaseAdmin
}));

// Reset mocks and database before each test
beforeEach(() => {
  resetMocks();
  resetDb();
});

// Export mock client for use in tests
export { mockSupabase }; 