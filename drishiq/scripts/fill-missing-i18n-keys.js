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

function unflatten(obj) {
  const result = {};
  for (const flatKey in obj) {
    const keys = flatKey.split('.');
    let cur = result;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        cur[k] = obj[flatKey];
      } else {
        if (!cur[k]) cur[k] = {};
        cur = cur[k];
      }
    });
  }
  return result;
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
  let master = {};
  if (fs.existsSync(MASTER_PATH)) {
    master = flatten(JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8')));
  }
  const tsxFiles = walk(SRC_DIR, '.tsx');
  const allKeys = new Set();
  for (const file of tsxFiles) {
    extractKeysFromFile(file).forEach(k => allKeys.add(k));
  }
  let added = 0;
  for (const key of allKeys) {
    if (!master[key]) {
      master[key] = key;
      added++;
    }
  }
  if (added > 0) {
    fs.writeFileSync(MASTER_PATH, JSON.stringify(unflatten(master), null, 2), 'utf8');
    console.log(`✅ Added ${added} missing keys to master.json`);
  } else {
    console.log('✅ No missing keys to add. master.json is up to date.');
  }
}

main(); 