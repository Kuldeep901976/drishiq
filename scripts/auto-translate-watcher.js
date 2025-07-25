const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const EN_FILE = path.join(LOCALES_DIR, 'en', 'master.json');
const DELAY_MS = 3500;
const MAX_RETRIES = 3;

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
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
    } else if (retries < MAX_RETRIES) {
      await new Promise(res => setTimeout(res, DELAY_MS));
      return translate(text, target, retries + 1);
    }
  } catch {
    if (retries < MAX_RETRIES) {
      await new Promise(res => setTimeout(res, DELAY_MS));
      return translate(text, target, retries + 1);
    }
  }
  return text;
}

function isUntranslated(enValue, langValue) {
  if (langValue === undefined || langValue === null) return true;
  if (typeof enValue === 'string' && typeof langValue === 'string') {
    return langValue.trim() === enValue.trim();
  }
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
      if (isUntranslated(base[key], compare[key])) {
        const translated = await translate(base[key], targetLang);
        compare[key] = translated;
        console.log(`[${targetLang}] ${fullKey}: ${translated}`);
        await new Promise(res => setTimeout(res, DELAY_MS));
      }
    }
  }
}

function getLangDirs() {
  return fs.readdirSync(LOCALES_DIR).filter(l => l !== 'en' && fs.statSync(path.join(LOCALES_DIR, l)).isDirectory());
}

function watchTranslations() {
  let lastContent = JSON.stringify(readJson(EN_FILE));
  fs.watchFile(EN_FILE, { interval: 1000 }, async (curr, prev) => {
    const newContent = JSON.stringify(readJson(EN_FILE));
    if (newContent !== lastContent) {
      lastContent = newContent;
      console.log('Detected change in English translations. Updating all languages...');
      const enJson = readJson(EN_FILE);
      const langs = getLangDirs();
      for (const lang of langs) {
        const langFile = path.join(LOCALES_DIR, lang, 'master.json');
        let langJson = readJson(langFile) || {};
        await fillMissingKeys(enJson, langJson, lang);
        writeJson(langFile, langJson);
        console.log(`[${lang}] Updated.`);
      }
      console.log('All languages updated.');
    }
  });
  console.log('Watching for changes in English translations...');
}

watchTranslations(); 