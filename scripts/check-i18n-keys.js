const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../public/locales/en/master.json');
const SRC_DIR = path.join(__dirname, '../');

function walk(dir, ext, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, ext, fileList);
    } else if (file.endsWith(ext)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function flatten(obj, prefix = '', res = {}) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flatten(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
}

function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /t\(['"`]([\w.-]+)['"`]/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

function main() {
  if (!fs.existsSync(MASTER_PATH)) {
    console.error('Master file not found:', MASTER_PATH);
    process.exit(1);
  }
  const master = flatten(JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8')));
  const tsxFiles = walk(SRC_DIR, '.tsx');
  const allKeys = new Set();
  for (const file of tsxFiles) {
    extractKeysFromFile(file).forEach(k => allKeys.add(k));
  }
  console.log('Translation keys found in code:');
  allKeys.forEach(k => console.log('  -', k));
  const missing = [];
  for (const key of allKeys) {
    if (!master[key]) missing.push(key);
  }
  if (missing.length > 0) {
    console.error('❌ The following translation keys are used in code but missing from master.json:');
    missing.forEach(k => console.error('  -', k));
    process.exit(1);
  } else {
    console.log('✅ All translation keys used in code exist in master.json');
  }
}

main(); 