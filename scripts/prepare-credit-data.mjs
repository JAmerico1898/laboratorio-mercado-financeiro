/**
 * One-time script to fetch credit risk CSVs from GitHub,
 * trim to curated features, and export as JSON to public/data/.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "data");

const BASE_URL =
  "https://raw.githubusercontent.com/JAmerico1898/gerenciamento_riscos/main";

const KEEP_COLUMNS = [
  "id",
  "loan_status",
  "loan_amnt",
  "int_rate",
  "log_annual_inc",
  "fico_score",
  "funded_amnt",
  "dti",
  "bc_util",
  "revol_util",
  "installment",
  "avg_cur_bal",
  "mort_acc",
  "num_actv_rev_tl",
];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, "").toLowerCase());

  const colIndices = KEEP_COLUMNS.map((col) => {
    const idx = headers.indexOf(col);
    if (idx === -1) {
      // Try without exact match (handle "Unnamed: 0" etc.)
      console.warn(`  Column "${col}" not found in headers`);
    }
    return idx;
  });

  const records = [];
  let dropped = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const record = {};
    let hasNaN = false;

    for (let j = 0; j < KEEP_COLUMNS.length; j++) {
      const idx = colIndices[j];
      if (idx === -1) {
        hasNaN = true;
        break;
      }
      const raw = values[idx]?.trim().replace(/"/g, "");
      const num = Number(raw);
      if (raw === "" || isNaN(num)) {
        hasNaN = true;
        break;
      }
      // Round to 4 decimal places to reduce JSON size
      record[KEEP_COLUMNS[j]] = Math.round(num * 10000) / 10000;
    }

    if (!hasNaN) {
      records.push(record);
    } else {
      dropped++;
    }
  }

  return { records, dropped };
}

async function fetchCSV(filename) {
  const url = `${BASE_URL}/${filename}`;
  console.log(`Fetching ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.status}`);
  }
  return response.text();
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Fetch and process training data
  const trainingCSV = await fetchCSV("training_sample.csv");
  const training = parseCSV(trainingCSV);
  console.log(
    `Training: ${training.records.length} records kept, ${training.dropped} dropped`
  );

  // Fetch and process production/testing data
  const testingCSV = await fetchCSV("testing_sample_true.csv");
  const testing = parseCSV(testingCSV);
  console.log(
    `Testing: ${testing.records.length} records kept, ${testing.dropped} dropped`
  );

  // Write as columnar format: { columns: [...], data: [[row1], [row2], ...] }
  // This is much more compact than array-of-objects
  function toColumnar(records) {
    const columns = KEEP_COLUMNS;
    const data = records.map((r) => columns.map((c) => r[c]));
    return { columns, data };
  }

  const trainingPath = join(OUTPUT_DIR, "training_sample.json");
  const testingPath = join(OUTPUT_DIR, "testing_sample.json");

  writeFileSync(trainingPath, JSON.stringify(toColumnar(training.records)));
  writeFileSync(testingPath, JSON.stringify(toColumnar(testing.records)));

  // Report file sizes
  const { statSync } = await import("fs");
  const trainingSize = (statSync(trainingPath).size / 1024 / 1024).toFixed(2);
  const testingSize = (statSync(testingPath).size / 1024 / 1024).toFixed(2);
  console.log(`\nOutput:`);
  console.log(`  ${trainingPath} (${trainingSize} MB)`);
  console.log(`  ${testingPath} (${testingSize} MB)`);
}

main().catch(console.error);
