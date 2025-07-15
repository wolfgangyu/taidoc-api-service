import { db } from '../__mocks__/inMemoryDb';
// @ts-ignore: If you see a type error here, ensure '@types/uuid' is installed as a devDependency.
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

// Creates patients with snake_case keys, matching the database schema.
export function createTestPatient(config: { group_id?: string; patient_id_external?: string } = {}) {
  const patient = {
    id: uuidv4(),
    group_id: config.group_id || 'TAI01',
    patient_id_external: config.patient_id_external || 'PATIENT-001',
  };
  db.patients.push(patient);
  return patient;
}

// Creates device_bindings with snake_case keys.
export function createTestDeviceBinding(
  patient_id: string,
  config: { device_type?: string; device_id?: string; extension_id?: string } = {}
) {
  const binding = {
    device_type: config.device_type || '3260',
    device_id: config.device_id || 'TEST-DEVICE-001',
    extension_id: config.extension_id || '0',
    patient_id,
    is_active: true,
    bound_at: new Date().toISOString(),
  };
  db.device_bindings.push(binding);
  return binding;
}

// Creates a mock Express request that simulates a streaming body.
export function createMockRequest(body: string): Request {
  const req: any = {
    body: body, // Set body directly for express.text() middleware
    ip: '127.0.0.1',
    headers: { 'content-type': 'text/plain;charset=us-ascii' },
  };
  return req as Request;
}

// Creates a mock Express response with chainable methods.
export function createMockResponse(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res as Response;
}

// Helper to create a measurement with snake_case keys
export function createTestMeasurement(patientId: string, deviceId: string, measurementDetails: {
  data_type: number;
  value1: number;
  value2?: number;
  measured_at: Date;
}) {
  const measurement = {
    id: uuidv4(),
    patient_id: patientId,
    device_id: deviceId,
    data_type: measurementDetails.data_type,
    value1: measurementDetails.value1,
    value2: measurementDetails.value2,
    measured_at: measurementDetails.measured_at.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.measurements.push(measurement);
  return measurement;
} 