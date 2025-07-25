const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const EN_FILE = path.join(LOCALES_DIR, 'en', 'master.json');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }
  return keys;
}

function checkMissingKeys(base, compare) {
  const baseKeys = getAllKeys(base);
  const compareKeys = getAllKeys(compare);
  return baseKeys.filter(key => !compareKeys.includes(key));
}

function setKey(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!curr[keys[i]]) curr[keys[i]] = {};
    curr = curr[keys[i]];
  }
  curr[keys[keys.length - 1]] = value;
}

function getValue(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function fillMissingKeys(base, compare, path = '') {
  // Recursively copy missing keys from base to compare
  for (const key in base) {
    const fullKey = path ? `${path}.${key}` : key;
    if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
      if (!compare[key] || typeof compare[key] !== 'object') {
        compare[key] = {};
      }
      fillMissingKeys(base[key], compare[key], fullKey);
    } else {
      // Overwrite if missing or if value is the same as the key
      if (!(key in compare) || compare[key] === key || compare[key] === fullKey) {
        compare[key] = base[key];
      }
    }
  }
}

function main() {
  const en = readJson(EN_FILE);
  if (!en) {
    console.error('English master.json not found!');
    process.exit(1);
  }

  const languages = fs.readdirSync(LOCALES_DIR).filter(l => l !== 'en' && fs.statSync(path.join(LOCALES_DIR, l)).isDirectory());
  let hasMissing = false;

  for (const lang of languages) {
    const langFile = path.join(LOCALES_DIR, lang, 'master.json');
    const data = readJson(langFile) || {};
    const before = JSON.stringify(data);
    fillMissingKeys(en, data);
    const after = JSON.stringify(data);
    if (before !== after) {
      hasMissing = true;
      fs.writeFileSync(langFile, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[${lang}] Filled missing keys with English values (nested supported).`);
    } else {
      console.log(`[${lang}] All keys present.`);
    }
  }

  if (!hasMissing) {
    console.log('\nAll languages have all keys!');
  } else {
    console.log('\nSome languages are missing keys.');
  }
}

if (require.main === module) {
  main();
} 