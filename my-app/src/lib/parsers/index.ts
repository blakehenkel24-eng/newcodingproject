import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedData {
  headers: string[];
  rows: (string | number)[][];
  raw: string;
}

export async function parseFile(file: File): Promise<ParsedData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        resolve({
          headers: data[0],
          rows: data.slice(1).filter(row => row.some(cell => cell.trim() !== '')),
          raw: results.meta as unknown as string,
        });
      },
      error: (error) => reject(error),
      skipEmptyLines: true,
    });
  });
}

async function parseExcel(file: File): Promise<ParsedData> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  // Use first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
  
  if (jsonData.length === 0) {
    throw new Error('Excel file is empty');
  }
  
  const headers = jsonData[0].map(h => String(h));
  const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
  
  return {
    headers,
    rows,
    raw: JSON.stringify(jsonData),
  };
}

async function parseJSON(file: File): Promise<ParsedData> {
  const text = await file.text();
  const data = JSON.parse(text);
  
  // Handle array of objects
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => obj[h]));
    
    return {
      headers,
      rows,
      raw: text,
    };
  }
  
  // Handle object with arrays
  if (typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    // Find the first array value
    const arrayKey = keys.find(k => Array.isArray(data[k]));
    if (arrayKey) {
      const arr = data[arrayKey];
      if (arr.length > 0 && typeof arr[0] === 'object') {
        const headers = Object.keys(arr[0]);
        const rows = arr.map((obj: Record<string, unknown>) => headers.map(h => obj[h]));
        return { headers, rows, raw: text };
      }
    }
  }
  
  // Fallback: return as single row
  return {
    headers: ['Data'],
    rows: [[text]],
    raw: text,
  };
}

export function formatParsedDataForLLM(parsed: ParsedData): string {
  const lines: string[] = [];
  
  // Add headers
  lines.push(parsed.headers.join('\t'));
  
  // Add rows (limit to first 50 rows to avoid token limits)
  const limitedRows = parsed.rows.slice(0, 50);
  for (const row of limitedRows) {
    lines.push(row.map(cell => String(cell)).join('\t'));
  }
  
  if (parsed.rows.length > 50) {
    lines.push(`... (${parsed.rows.length - 50} more rows)`);
  }
  
  return lines.join('\n');
}
