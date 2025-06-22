import { db } from './inMemoryDb';

// Helper functions for case conversion
const toSnakeCase = (str: string) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1_$2')
    .toLowerCase();
const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Helper function to get all possible column names
const getColumnVariants = (column: string) => {
  const variants = new Set([column]);
  variants.add(toSnakeCase(column));
  variants.add(toCamelCase(column));
  return Array.from(variants);
};

// This function will be the core of our query simulation
const executeQuery = (tableName: keyof typeof db, queryChain: any[]) => {
  let results = [...db[tableName]];

  queryChain.forEach(step => {
    if (step.type === 'select') {
      // If specific columns are selected, filter the results
      if (step.column !== '*') {
        const columns = step.column.split(',').map((col: string) => col.trim());
        results = results.map(item => {
          const filteredItem: any = {};
          columns.forEach((col: string) => {
            const variants = getColumnVariants(col);
            const matchingKey = Object.keys(item).find(key => variants.includes(key));
            if (matchingKey) {
              filteredItem[col] = item[matchingKey];
            }
          });
          return filteredItem;
        });
      }
    } else if (step.type === 'eq') {
      const columnVariants = getColumnVariants(step.column);
      results = results.filter(item => 
        columnVariants.some(col => item[col] === step.value)
      );
    }
  });

  return results;
};

// CORRECTED TYPE DEFINITION: Now correctly handles both select and eq shapes
const createQueryBuilder = (tableName: keyof typeof db) => {
  let queryChain: { type: 'eq'; column: string; value: any }[] = [];

  const self: any = {
    select: (columns = '*') => self,
    insert: (records: any | any[]) => {
      const items = Array.isArray(records) ? records : [records];
      db[tableName].push(...items);
      return Promise.resolve({ data: items, error: null });
    },
    upsert: (record: any, options?: { onConflict?: string }) => {
      const conflictColumns = options?.onConflict?.split(',');
      if (conflictColumns) {
        const existingIndex = db[tableName].findIndex(item =>
          conflictColumns.every(col => item[col] === record[col])
        );
        if (existingIndex > -1) {
          db[tableName][existingIndex] = { ...db[tableName][existingIndex], ...record };
        } else {
          db[tableName].push(record);
        }
      } else {
        db[tableName].push(record);
      }
      return Promise.resolve({ data: [record], error: null });
    },
    eq: (column: string, value: any) => {
      queryChain.push({ type: 'eq', column, value });
      return self;
    },
    single: () => {
      let results = [...db[tableName]];
      queryChain.forEach(step => {
        results = results.filter(item => item[step.column] === step.value);
      });
      const data = results.length > 0 ? results[0] : null;
      const error = data ? null : { code: 'PGRST116', message: 'No row found' };
      return Promise.resolve({ data, error });
    },
  };
  return self;
};

const mockFrom = jest.fn((tableName: keyof typeof db) => createQueryBuilder(tableName));
export const supabaseAdmin = { from: mockFrom };
export const resetMocks = () => { mockFrom.mockClear(); };

// Export mock functions for testing
export const mockSupabaseFunctions = {
  from: jest.fn(),
  single: jest.fn(),
  eq: jest.fn(),
  neq: jest.fn(),
  insert: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
};

export const mockResponses = {
  success: { data: null, error: null },
  error: { data: null, error: { code: '23505', message: 'Mock error' } },
}; 