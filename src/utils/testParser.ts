import { parseKeyValueString } from './parser';

// Test cases
const testCases = [
  {
    name: 'URL-encoded string',
    input: 'FunctionName=GetDateTime&GatewayID=GATE001&GroupID=GROUP001&PatientID=PAT001',
    expected: {
      FunctionName: 'GetDateTime',
      GatewayID: 'GATE001',
      GroupID: 'GROUP001',
      PatientID: 'PAT001'
    }
  },
  {
    name: 'Newline-separated string',
    input: 'FunctionName=GetDateTime\r\nGatewayID=GATE001\r\nGroupID=GROUP001\r\nPatientID=PAT001',
    expected: {
      FunctionName: 'GetDateTime',
      GatewayID: 'GATE001',
      GroupID: 'GROUP001',
      PatientID: 'PAT001'
    }
  },
  {
    name: 'Object input (simulating Express middleware)',
    input: {
      'FunctionName=GetDateTime&GatewayID=GATE001&GroupID=GROUP001&PatientID=PAT001': ''
    },
    expected: {
      FunctionName: 'GetDateTime',
      GatewayID: 'GATE001',
      GroupID: 'GROUP001',
      PatientID: 'PAT001'
    }
  },
  {
    name: 'URL-encoded with special characters',
    input: 'FunctionName=AddNewData&GatewayID=GATE%20001&Note=Test%20Note%20with%20%26%20symbols',
    expected: {
      FunctionName: 'AddNewData',
      GatewayID: 'GATE 001',
      Note: 'Test Note with & symbols'
    }
  },
  {
    name: 'Empty input',
    input: '',
    expected: {}
  },
  {
    name: 'Invalid format',
    input: 'InvalidFormat',
    expected: {}
  },
  {
    name: 'Mixed format',
    input: 'FunctionName=GetDateTime\r\nGatewayID=GATE001&GroupID=GROUP001\r\nPatientID=PAT001',
    expected: {
      FunctionName: 'GetDateTime',
      GatewayID: 'GATE001',
      GroupID: 'GROUP001',
      PatientID: 'PAT001'
    }
  }
];

// Run tests
console.log('Testing parseKeyValueString function...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}: ${testCase.name}`);
  console.log('Input:', testCase.input);
  
  try {
    const result = parseKeyValueString(testCase.input);
    console.log('Result:', result);
    
    // Compare results
    const isEqual = JSON.stringify(result) === JSON.stringify(testCase.expected);
    console.log('Test', isEqual ? 'PASSED' : 'FAILED');
    
    if (!isEqual) {
      console.log('Expected:', testCase.expected);
    }
  } catch (error) {
    console.log('Test FAILED with error:', error);
  }
  
  console.log('\n' + '-'.repeat(80) + '\n');
});

export function parseTestData(input: string): Record<string, string> {
  return parseKeyValueString(input);
} 