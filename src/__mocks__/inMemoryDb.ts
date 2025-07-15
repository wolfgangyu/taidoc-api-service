// Define the structure of our in-memory database
interface DbStore {
  [key: string]: any[];
  patients: any[];
  devices: any[];
  measurements: any[];
  device_bindings: any[];
}

// The single source of truth for our test database.
export let db: DbStore = { patients: [], devices: [], measurements: [], device_bindings: [] };

// This function MUTATES the existing db object by clearing its arrays.
// This ensures all modules that import 'db' see the changes.
export const resetDb = () => {
  db.patients.length = 0;
  db.devices.length = 0;
  db.measurements.length = 0;
  db.device_bindings.length = 0;
}; 