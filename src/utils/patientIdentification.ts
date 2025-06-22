import { supabaseAdmin } from '../lib/supabaseAdmin';
import logger from '../lib/logger';

// Interface uses snake_case for internal consistency.
export interface PatientIdParams {
  group_id?: string;
  patient_id_external?: string;
  device_id?: string;
  device_type?: string;
  extension_id?: string;
}

export interface PatientIdResult {
  success: boolean;
  patientId?: string;
}

export async function identifyPatient(params: PatientIdParams): Promise<PatientIdResult> {
  try {
    // Priority 1: Check if the device is already bound.
    if (params.device_type && params.device_id) {
      const { data: device, error: deviceError } = await supabaseAdmin
        .from('devices')
        .select('patient_id')
        .eq('device_type', params.device_type)
        .eq('device_id', params.device_id)
        .single();

      if (deviceError && deviceError.code !== 'PGRST116') { throw deviceError; }
      if (device?.patient_id) {
        return { success: true, patientId: device.patient_id };
      }
    }

    // Priority 2: If unbound, find patient by external IDs and then bind the device.
    if (params.group_id && params.patient_id_external) {
      const { data: patient, error: patientError } = await supabaseAdmin
        .from('patients')
        .select('id')
        .eq('group_id', params.group_id)
        .eq('patient_id_external', params.patient_id_external)
        .single();
      
      if (patientError && patientError.code !== 'PGRST116') { throw patientError; }

      if (patient?.id) {
        if (params.device_type && params.device_id) {
          const { error: upsertError } = await supabaseAdmin.from('devices').upsert({
            device_type: params.device_type,
            device_id: params.device_id,
            extension_id: params.extension_id || '0',
            patient_id: patient.id,
          });
          if (upsertError) { throw upsertError; }
        }
        return { success: true, patientId: patient.id };
      }
    }
    
    // If neither method results in finding a patient ID, return failure.
    return { success: false };

  } catch (error) {
    logger.error({ error, params }, "Critical error during patient identification");
    return { success: false };
  }
} 