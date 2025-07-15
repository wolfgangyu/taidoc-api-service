import request from 'supertest';
import app from '../index'; // Import the Express app
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

describe('TaiDoc API End-to-End Tests', () => {
  it('GET / should return service status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('API Service is running');
  });

  it('POST /api/taidoc/timeSync should handle time sync requests', async () => {
    const body = `DeviceType=3260&DeviceID=E2E-TEST-01`;
    const res = await request(app)
      .post('/api/taidoc/timeSync')
      .set('Content-Type', 'text/plain;charset=us-ascii')
      .type('text/plain;charset=us-ascii')
      .send(body);

    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/^2000\r\n/);
  });

  it('POST /api/taidoc/gateway should return 2002 for unbound devices', async () => {
    const body = [
      'DeviceType=E2E-DEVICE',
      'DeviceID=E2E-UNBOUND-01',
      'ExtensionID=0',
      'GatewayID=E2E-GW-01',
      'DataType=1',
      'Value1=123',
      'Year=2025',
      'Month=1',
      'Day=1',
      'Hour=10',
      'Minute=0',
      'Second=0'
    ].join('\r\n');
    const res = await request(app)
      .post('/api/taidoc/gateway')
      .set('Content-Type', 'text/plain;charset=us-ascii')
      .type('text/plain;charset=us-ascii')
      .send(body);

    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/^2002\r\n/);
  });

  it('POST /api/taidoc/gateway should return 2000 for a device with a valid binding', async () => {
    // Arrange: create a patient and a device binding
    const patientId = uuidv4();
    await supabaseAdmin.from('patients').insert([{ id: patientId }]);
    await supabaseAdmin.from('device_bindings').insert([{
      device_type: 'E2E-DEVICE',
      device_id: 'E2E-BOUND-01',
      extension_id: '0',
      patient_id: patientId,
      is_active: true
    }]);
    const body = [
      'DeviceType=E2E-DEVICE',
      'DeviceID=E2E-BOUND-01',
      'ExtensionID=0',
      'GatewayID=E2E-GW-01',
      'DataType=1',
      'Value1=123',
      'Year=2025',
      'Month=1',
      'Day=1',
      'Hour=10',
      'Minute=0',
      'Second=0'
    ].join('\r\n');
    const res = await request(app)
      .post('/api/taidoc/gateway')
      .set('Content-Type', 'text/plain;charset=us-ascii')
      .type('text/plain;charset=us-ascii')
      .send(body);

    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/^2000\r\n/);
  });
}); 