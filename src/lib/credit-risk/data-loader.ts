import { CreditRecord } from "./types";

interface ColumnarData {
  columns: string[];
  data: number[][];
}

/**
 * Convert columnar JSON format to array of CreditRecord objects.
 */
export function parseColumnarData(raw: ColumnarData): CreditRecord[] {
  const { columns, data } = raw;
  return data.map((row) => {
    const record: CreditRecord = { id: 0, loan_status: 0 };
    for (let j = 0; j < columns.length; j++) {
      record[columns[j]] = row[j];
    }
    return record;
  });
}

/**
 * Extract feature matrix and target vector from records.
 */
export function extractFeatures(
  records: CreditRecord[],
  featureKeys: string[]
): { X: number[][]; y: number[]; ids: number[] } {
  const X: number[][] = [];
  const y: number[] = [];
  const ids: number[] = [];

  for (const record of records) {
    const row: number[] = [];
    let valid = true;
    for (const key of featureKeys) {
      const val = record[key];
      if (val === undefined || val === null || isNaN(val)) {
        valid = false;
        break;
      }
      row.push(val);
    }
    if (valid) {
      X.push(row);
      y.push(record.loan_status);
      ids.push(record.id);
    }
  }

  return { X, y, ids };
}

/**
 * Fetch and parse a JSON data file from public/data/.
 */
export async function loadDataset(filename: string): Promise<CreditRecord[]> {
  const response = await fetch(`/data/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${filename}: ${response.status}`);
  }
  const raw: ColumnarData = await response.json();
  return parseColumnarData(raw);
}
