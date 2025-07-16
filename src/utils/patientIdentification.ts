import { supabaseAdmin } from '../lib/supabaseAdmin';
import logger from '../lib/logger';

export interface PatientIdParams {
  device_id?: string;
  device_type?: string;
  extension_id?: string;
  group_id?: string;
  patient_id_external?: string;
}

export interface PatientIdResult {
  success: boolean;
  patientId?: string; // Internal UUID
}

// This function's only job is to check for an existing binding.
export async function identifyPatient(params: PatientIdParams): Promise<PatientIdResult> {
  // Priority 1: Check if the device is already bound using all three keys.
  if (params.device_type && params.device_id) {
    const { data: device, error } = await supabaseAdmin
      .from('device_bindings')
      .select('patient_id')
      .eq('device_type', params.device_type)
      .eq('device_id', params.device_id)
      // CRITICAL FIX: Add the missing extension_id to the query
      .eq('extension_id', params.extension_id || '0') 
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error({ error, params }, "Device binding lookup failed");
      throw error;
    }

    if (device?.patient_id) {
      return { success: true, patientId: device.patient_id };
    }
  }

  // Priority 2 logic remains the same.
  if (params.group_id && params.patient_id_external) {
    // ... (rest of the function) ...
  }

  return { success: false };
} 