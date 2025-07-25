const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const EN_FILE = path.join(LOCALES_DIR, 'en', 'master.json');
const LANGS = fs.readdirSync(LOCALES_DIR).filter(l => l !== 'en' && fs.statSync(path.join(LOCALES_DIR, l)).isDirectory());
const DELAY_MS = 3500; // Increased delay to avoid rate limits
const MAX_RETRIES = 3;

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      keys.push({ path: prefix ? `${prefix}.${key}` : key, value: obj[key] });
    }
  }
  return keys;
}

function setNested(obj, path, value) {
  const keys = path.split('.');
  let curr = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!curr[keys[i]]) curr[keys[i]] = {};
    curr = curr[keys[i]];
  }
  curr[keys[keys.length - 1]] = value;
}

function isUntranslated(key, enValue, langValue) {
  // Consider untranslated if missing or identical to English
  if (langValue === undefined || langValue === null) return true;
  if (typeof enValue === 'string' && typeof langValue === 'string') {
    return langValue.trim() === enValue.trim();
  }
  // For arrays or objects, fallback to missing
  return false;
}

async function fillMissingKeys(base, compare, targetLang, path = '') {
  for (const key in base) {
    const fullKey = path ? `${path}.${key}` : key;
    if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
      if (!compare[key] || typeof compare[key] !== 'object') {
        compare[key] = {};
      }
      await fillMissingKeys(base[key], compare[key], targetLang, fullKey);
    } else {
      if (isUntranslated(key, base[key], compare[key])) {
        const translated = await translate(base[key], targetLang);
        compare[key] = translated;
        console.log(`[${targetLang}] ${fullKey}: ${translated}`);
        await new Promise(res => setTimeout(res, DELAY_MS));
      }
    }
  }
}

async function translate(text, target, retries = 0) {
  const url = 'https://libretranslate.de/translate';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target, format: 'text' })
    });
    if (res.ok) {
      const data = await res.json();
      return data.translatedText;
    } else {
      if (retries < MAX_RETRIES) {
        await new Promise(res => setTimeout(res, DELAY_MS));
        return translate(text, target, retries + 1);
      }
    }
  } catch (e) {
    if (retries < MAX_RETRIES) {
      await new Promise(res => setTimeout(res, DELAY_MS));
      return translate(text, target, retries + 1);
    }
  }
  return text;
}

async function main() {
  const en = readJson(EN_FILE);
  if (!en) {
    console.error('English master.json not found!');
    process.exit(1);
  }
  const allKeys = getAllKeys(en);
  for (const lang of LANGS) {
    const langFile = path.join(LOCALES_DIR, lang, 'master.json');
    let data = readJson(langFile) || {};
    console.log(`Translating for [${lang}]...`);
    await fillMissingKeys(en, data, lang);
    writeJson(langFile, data);
    console.log(`[${lang}] Updated.`);
  }
  console.log('All languages updated with machine translations.');
}

if (require.main === module) {
  main();
} 