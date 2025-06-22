// src/utils/formatters.ts
import crypto from 'crypto';

export function parseKeyValueString(input: any): Record<string, string> {
  const params: Record<string, string> = {};
  if (typeof input !== 'string' || !input) return params;
  
  // Check if the input contains & separators (URL query parameter style)
  if (input.includes('&')) {
    const pairs = input.split('&');
    for (const pair of pairs) {
      if (!pair) continue; // Skip empty pairs
      const parts = pair.split('=');
      if (parts.length >= 2) {
        try {
          const key = decodeURIComponent(parts[0].trim());
          const value = decodeURIComponent(parts.slice(1).join('=').trim());
          if (key) {
            params[key] = value;
          }
        } catch (error) {
          // Skip this key-value pair if URI decoding fails
          console.warn('URI decoding failed for pair:', pair, error);
        }
      }
    }
  } else {
    // This regex splits on CRLF (\r\n) or LF (\n)
    const lines = input.split(/\r?\n/);
    for (const line of lines) {
      if (!line) continue; // Skip empty lines
      const parts = line.split('=');
      if (parts.length >= 2) {
        try {
          const key = decodeURIComponent(parts[0].trim());
          const value = decodeURIComponent(parts.slice(1).join('=').trim());
          if (key) {
            params[key] = value;
          }
        } catch (error) {
          // Skip this key-value pair if URI decoding fails
          console.warn('URI decoding failed for line:', line, error);
        }
      }
    }
  }
  return params;
}

export function formatErrorResponse(responseCode: string): string {
  return `${responseCode}\r\n\r\n`;
}

export function formatGetDateTimeResponse(responseCode: string, systemTime: string): string {
  return `${responseCode}\r\n${systemTime}\r\n${systemTime}\r\n`;
}

export function formatAddNewDataResponse(
  responseCode: string,
  groupId: string | undefined,
  patientId: string | undefined,
  dataSysId: string
): string {
  return `${responseCode}\r\n${groupId || ''}\r\n${patientId || ''}\r\n${dataSysId || ''}\r\n`;
}

export function generateDataSysId(): string {
  const timestamp = Date.now();
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${timestamp}-${randomPart}`;
}

export function parseMeasurementTime(params: Record<string, string>): Date | null {
  const { year, month, day, hour, minute, second } = params;
  if ([year, month, day, hour, minute, second].some(v => v === undefined)) {
    return null;
  }
  
  // Parse and validate all components
  const yearNum = Number(year);
  const monthNum = Number(month);
  const dayNum = Number(day);
  const hourNum = Number(hour);
  const minuteNum = Number(minute);
  const secondNum = Number(second);
  
  // Check for NaN values
  if ([yearNum, monthNum, dayNum, hourNum, minuteNum, secondNum].some(Number.isNaN)) {
    return null;
  }
  
  // Validate ranges
  if (yearNum < 1900 || yearNum > 2100) return null;
  if (monthNum < 1 || monthNum > 12) return null;
  if (dayNum < 1 || dayNum > 31) return null;
  if (hourNum < 0 || hourNum > 23) return null;
  if (minuteNum < 0 || minuteNum > 59) return null;
  if (secondNum < 0 || secondNum > 59) return null;
  
  // Month is 0-indexed in JavaScript Date
  return new Date(yearNum, monthNum - 1, dayNum, hourNum, minuteNum, secondNum);
}

// This is a placeholder for the real conversion and validation logic.
// In a real app, this would be a large switch statement based on dataType.
export function convertMeasurementValues(dataType: number, params: Record<string, string>) {
  const value1 = parseFloat(params.value1);
  const value2 = params.value2 ? parseFloat(params.value2) : undefined;
  const value3 = params.value3 ? parseFloat(params.value3) : undefined;
  
  // Check for NaN values
  if (Number.isNaN(value1) || (value2 !== undefined && Number.isNaN(value2)) || (value3 !== undefined && Number.isNaN(value3))) {
    return {
      values: {},
      validation: {
        isValid: false
      }
    };
  }
  
  return {
    values: {
      value1: params.value1,
      value2: params.value2,
      value3: params.value3,
    },
    validation: {
      isValid: true // Assume valid for now
    }
  };
} 