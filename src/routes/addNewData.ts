import { Request, Response } from 'express';
import { identifyPatient } from '../utils/patientIdentification';
import { parseKeyValueString, convertMeasurementValues, generateDataSysId, parseMeasurementTime, formatErrorResponse, formatAddNewDataResponse } from '../utils/formatters';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import logger from '../lib/logger';

const normalizeKeys = (obj: Record<string, string>): Record<string, string> => {
    const newObj: Record<string, string> = {};
    for (const key in obj) {
        let newKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
        if (key === 'PatientID') newKey = 'patient_id_external';
        newObj[newKey] = obj[key];
    }
    return newObj;
};

export async function handleAddNewDataRequest(req: Request, res: Response) {
    try {
        const parsedParams = parseKeyValueString(req.body);
        const params = normalizeKeys(parsedParams);

        const required = ['data_type', 'year', 'month', 'day', 'hour', 'minute', 'second', 'value1'];
        if (required.some(p => params[p] === undefined)) {
            return res.status(400).send(formatErrorResponse('4007'));
        }
        
        // Add NaN check for data_type
        const dataType = parseInt(params.data_type);
        if (Number.isNaN(dataType)) {
            return res.status(400).send(formatErrorResponse('4001'));
        }
        
        const patientResult = await identifyPatient(params);
        if (!patientResult.success || !patientResult.patientId) {
            return res.status(200).send(formatAddNewDataResponse('2002', params.group_id, params.patient_id_external, ''));
        }
        
        const measuredAt = parseMeasurementTime(params);
        if (!measuredAt) return res.status(400).send(formatErrorResponse('4001'));

        const conversionResult = convertMeasurementValues(dataType, params);
        if(!conversionResult.validation.isValid) return res.status(400).send(formatErrorResponse('4001'));
        
        const dataSysId = generateDataSysId();
        const { error: insertError } = await supabaseAdmin.from('measurements').insert([{
            data_sys_id: dataSysId, patient_id: patientResult.patientId, gateway_id: params.gateway_id,
            device_type: params.device_type, device_id: params.device_id,
            extension_id: params.extension_id, measured_at: measuredAt.toISOString(), 
            data_type: dataType, values: conversionResult.values,
        }]);

        if (insertError) { throw insertError; }
        
        res.setHeader('Content-Type', 'text/plain;charset=us-ascii');
        res.status(200).send(formatAddNewDataResponse('2000', params.group_id, params.patient_id_external, dataSysId));

    } catch (error: any) {
        logger.error({ error: error.stack }, "Error in AddNewData handler");
        res.setHeader('Content-Type', 'text/plain;charset=us-ascii');
        res.status(500).send(formatErrorResponse('5000'));
    }
} 