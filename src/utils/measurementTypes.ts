// src/utils/measurementTypes.ts

// This is a simple, robust parser that handles both \r\n and \n separators, as well as & separators.
export function parseKeyValueString(input: any): Record<string, string> {
  const params: Record<string, string> = {};
  if (typeof input !== 'string' || !input) {
    return params;
  }

  // Check if the input contains & separators (URL query parameter style)
  if (input.includes('&')) {
    const pairs = input.split('&');
    for (const pair of pairs) {
      if (!pair) continue; // Skip empty pairs
      const parts = pair.split('=');
      if (parts.length >= 2) {
        const key = decodeURIComponent(parts[0].trim());
        const value = decodeURIComponent(parts.slice(1).join('=').trim());
        if (key) {
          params[key] = value;
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
        const key = decodeURIComponent(parts[0].trim());
        const value = decodeURIComponent(parts.slice(1).join('=').trim());
        if (key) {
          params[key] = value;
        }
      }
    }
  }
  return params;
}

// All formatters now correctly use \r\n and have a trailing newline.
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
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}-${randomPart}`;
}

export function parseMeasurementTime(params: Record<string, string>): Date | null {
  const { year, month, day, hour, minute, second } = params;
  if ([year, month, day, hour, minute, second].some(v => v === undefined)) {
    return null;
  }
  // Month is 0-indexed in JavaScript Date
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
}

// This is a placeholder for the real conversion and validation logic.
// In a real app, this would be a large switch statement based on dataType.
export function convertMeasurementValues(dataType: number, params: Record<string, string>) {
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