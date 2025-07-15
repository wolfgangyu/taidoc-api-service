import { supabaseAdmin } from '../lib/supabaseAdmin';
import logger from '../lib/logger';

export interface PatientIdParams {
  device_id?: string;
  device_type?: string;
  extension_id?: string;
}

export interface PatientIdResult {
  success: boolean;
  patientId?: string; // Internal UUID
}

// This function's only job is to check for an existing binding.
export async function identifyPatient(params: PatientIdParams): Promise<PatientIdResult> {
  if (!params.device_type || !params.device_id) {
    logger.warn({ params }, 'Identification failed: Missing device identifiers.');
    return { success: false };
  }

  try {
    const { data: binding, error } = await supabaseAdmin
      .from('device_bindings')
      .select('patient_id')
      .eq('device_type', params.device_type)
      .eq('device_id', params.device_id)
      .eq('extension_id', params.extension_id || '0')
      .eq('is_active', true) // Ensure the binding is active
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'No row found' error
      throw error;
    }

    if (binding?.patient_id) {
      return { success: true, patientId: binding.patient_id };
    }

    // If no binding is found, the identification fails.
    return { success: false };

  } catch (error) {
    logger.error({ error, params }, "Critical error during device binding lookup");
    return { success: false };
  }
} 