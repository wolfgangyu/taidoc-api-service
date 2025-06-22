/**
 * Parses a key-value string into a Record object.
 * @param input - The input string or object to parse
 * @returns A Record containing the parsed key-value pairs
 */
export function parseKeyValueString(input: any): Record<string, string> {
  if (typeof input === 'object' && input !== null) {
    return input;
  }

  if (typeof input !== 'string') {
    return {};
  }

  const result: Record<string, string> = {};
  const pairs = input.split('&');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      result[key] = decodeURIComponent(value);
    }
  }

  return result;
} 