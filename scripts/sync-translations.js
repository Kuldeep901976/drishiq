const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../public/locales/en/master.json');
const LOCALES_DIR = path.join(__dirname, '../public/locales');

// List of all 23 language codes (excluding 'en')
const LANGUAGES = [
  'hi', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'tr', 'nl',
  'pl', 'sv', 'da', 'no', 'fi', 'bn', 'ta', 'te', 'kn', 'mr', 'ur'
];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
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

function syncLanguage(lang) {
  const langDir = path.join(LOCALES_DIR, lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);
  const langFile = path.join(langDir, 'master.json');
  const langData = readJson(langFile);
  const flatLang = flatten(langData);

  const masterData = readJson(MASTER_PATH);
  const flatMaster = flatten(masterData);

  let updated = false;
  let missing = [];
  const out = {};
  for (const key in flatMaster) {
    if (flatLang[key] === undefined) {
      out[key] = flatMaster[key];
      missing.push(key);
      updated = true;
    } else {
      out[key] = flatLang[key];
    }
  }

  if (updated) {
    writeJson(langFile, unflatten(out));
    console.log(`[${lang}] Synced. Missing keys filled:`, missing.length);
    if (missing.length > 0) {
      console.log(`[${lang}] Missing keys:`, missing);
    }
  } else {
    console.log(`[${lang}] Already up to date.`);
  }
}

function main() {
  if (!fs.existsSync(MASTER_PATH)) {
    console.error('Master file not found:', MASTER_PATH);
    process.exit(1);
  }
  LANGUAGES.forEach(syncLanguage);
  console.log('✅ All languages synced with master.');
}

main(); 