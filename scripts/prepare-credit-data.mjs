/**
 * One-time script to convert the credit-risk CSVs served in public/data/
 * into compact columnar JSON consumed by the Module 2 app.
 *
 * Mapping (leakage-free, mirrors a real credit pipeline):
 *   training_sample.csv      -> training_sample.json       (labeled, used to TRAIN)
 *   testing_sample.csv       -> testing_sample.json        (NO label, the produção INPUT)
 *   testing_sample_true.csv  -> testing_sample_true.json   (true labels, used to GRADE)
 *
 * The two 50k test files are the same applicants (identical `id`s); the JSON
 * outputs are intersected by `id` so produção scores and true labels align row-for-row.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "public", "data");

// id + loan_status + 12 predictor features
const FEATURE_COLUMNS = [
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
const LABELED_COLUMNS = ["id", "loan_status", ...FEATURE_COLUMNS];
const FEATURE_ONLY_COLUMNS = ["id", ...FEATURE_COLUMNS];

/**
 * Parse a CSV into records keyed by the requested columns. Rows with a missing
 * or non-numeric value in any requested column are dropped.
 */
function parseCSV(text, keepColumns) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/"/g, "").toLowerCase());

  const colIndices = keepColumns.map((col) => {
    const idx = headers.indexOf(col);
    if (idx === -1) console.warn(`  Column "${col}" not found in headers`);
    return idx;
  });

  const records = [];
  let dropped = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const record = {};
    let hasNaN = false;

    for (let j = 0; j < keepColumns.length; j++) {
      const idx = colIndices[j];
      if (idx === -1) {
        hasNaN = true;
        break;
      }
      const raw = values[idx]?.trim().replace(/"/g, "");
      const num = Number(raw);
      if (raw === "" || raw === undefined || isNaN(num)) {
        hasNaN = true;
        break;
      }
      // Round to 4 decimals to keep JSON small
      record[keepColumns[j]] = Math.round(num * 10000) / 10000;
    }

    if (!hasNaN) records.push(record);
    else dropped++;
  }

  return { records, dropped };
}

function toColumnar(records, columns) {
  return { columns, data: records.map((r) => columns.map((c) => r[c])) };
}

function readCSV(filename) {
  return readFileSync(join(DATA_DIR, filename), "utf8");
}

function writeJSON(filename, payload) {
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(payload));
  const sizeMB = (statSync(path).size / 1024 / 1024).toFixed(2);
  console.log(`  wrote ${filename} (${sizeMB} MB)`);
}

function main() {
  mkdirSync(DATA_DIR, { recursive: true });

  // 1. Training set (labeled) ------------------------------------------------
  const training = parseCSV(readCSV("training_sample.csv"), LABELED_COLUMNS);
  console.log(
    `training_sample: ${training.records.length} kept, ${training.dropped} dropped`
  );
  writeJSON("training_sample.json", toColumnar(training.records, LABELED_COLUMNS));

  // 2. Produção input (features only) + 3. true labels, intersected by id ----
  const testFeatures = parseCSV(readCSV("testing_sample.csv"), FEATURE_ONLY_COLUMNS);
  const testTrue = parseCSV(readCSV("testing_sample_true.csv"), LABELED_COLUMNS);
  console.log(
    `testing_sample: ${testFeatures.records.length} kept, ${testFeatures.dropped} dropped`
  );
  console.log(
    `testing_sample_true: ${testTrue.records.length} kept, ${testTrue.dropped} dropped`
  );

  const trueById = new Map(testTrue.records.map((r) => [r.id, r]));
  const featuresAligned = [];
  const trueAligned = [];
  for (const rec of testFeatures.records) {
    const truth = trueById.get(rec.id);
    if (truth) {
      featuresAligned.push(rec);
      trueAligned.push(truth);
    }
  }
  console.log(`aligned produção rows (present in both): ${featuresAligned.length}`);

  writeJSON("testing_sample.json", toColumnar(featuresAligned, FEATURE_ONLY_COLUMNS));
  writeJSON(
    "testing_sample_true.json",
    toColumnar(trueAligned, LABELED_COLUMNS)
  );
}

main();
