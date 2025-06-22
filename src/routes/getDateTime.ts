import { Request, Response } from 'express';
import { parseKeyValueString, formatGetDateTimeResponse, formatErrorResponse } from '../utils/formatters';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import logger from '../lib/logger';

export async function handleGetDateTimeRequest(req: Request, res: Response) {
  try {
    const params = parseKeyValueString(req.body);
    const required = ['DeviceType', 'DeviceID'];
    if (required.some(p => !params[p])) {
      return res.status(400).send(formatErrorResponse('4007'));
    }

    await supabaseAdmin.from('devices').upsert({
        device_type: params.DeviceType,
        device_id: params.DeviceID,
        extension_id: params.ExtensionID || '0',
        last_seen_at: new Date().toISOString(),
    }, { onConflict: 'device_type,device_id,extension_id' });
    
    const now = new Date();
    const systemTime = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    res.setHeader('Content-Type', 'text/plain;charset=us-ascii');
    res.status(200).send(formatGetDateTimeResponse('2000', systemTime));

  } catch (error: any) {
    logger.error({ error: error.stack }, 'Error in GetDateTime handler');
    res.setHeader('Content-Type', 'text/plain;charset=us-ascii');
    res.status(500).send(formatErrorResponse('5000'));
  }
} 