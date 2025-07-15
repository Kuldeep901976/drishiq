const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(process.cwd(), 'public/locales');
const REFERENCE_LOCALE = 'en';

// Utility functions
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}

// Test functions
function testMissingKeys(referenceKeys, targetLocale, targetKeys) {
  const missing = referenceKeys.filter(key => !targetKeys.includes(key));
  if (missing.length > 0) {
    console.error(`\n❌ Missing keys in ${targetLocale}:`);
    missing.forEach(key => console.error(`  - ${key}`));
    return false;
  }
  console.log(`✅ No missing keys in ${targetLocale}`);
  return true;
}

function testExtraKeys(referenceKeys, targetLocale, targetKeys) {
  const extra = targetKeys.filter(key => !referenceKeys.includes(key));
  if (extra.length > 0) {
    console.error(`\n⚠️ Extra keys in ${targetLocale}:`);
    extra.forEach(key => console.error(`  - ${key}`));
    return false;
  }
  console.log(`✅ No extra keys in ${targetLocale}`);
  return true;
}

function testPlaceholders(referenceObj, targetObj, targetLocale) {
  const referencePlaceholders = {};
  const targetPlaceholders = {};
  
  // Extract placeholders using regex
  Object.entries(referenceObj).forEach(([key, value]) => {
    const matches = String(value).match(/{{.*?}}/g);
    if (matches) referencePlaceholders[key] = matches;
  });
  
  Object.entries(targetObj).forEach(([key, value]) => {
    const matches = String(value).match(/{{.*?}}/g);
    if (matches) targetPlaceholders[key] = matches;
  });
  
  let hasError = false;
  Object.entries(referencePlaceholders).forEach(([key, refPlaceholders]) => {
    const targetValue = targetPlaceholders[key];
    if (!targetValue || JSON.stringify(refPlaceholders.sort()) !== JSON.stringify(targetValue.sort())) {
      console.error(`\n❌ Placeholder mismatch in ${targetLocale} for key "${key}":`);
      console.error(`  Reference: ${refPlaceholders.join(', ')}`);
      console.error(`  Target: ${targetValue ? targetValue.join(', ') : 'none'}`);
      hasError = true;
    }
  });
  
  if (!hasError) {
    console.log(`✅ All placeholders match in ${targetLocale}`);
    return true;
  }
  return false;
}

// Main test execution
function runTests() {
  console.log('🔍 Starting i18n tests...\n');
  
  // Load reference locale
  const referenceFile = path.join(LOCALES_DIR, REFERENCE_LOCALE, 'common.json');
  const referenceTranslations = loadJSON(referenceFile);
  if (!referenceTranslations) return;
  
  const flattenedReference = flattenObject(referenceTranslations);
  const referenceKeys = Object.keys(flattenedReference);
  
  // Get all locales
  const locales = fs.readdirSync(LOCALES_DIR)
    .filter(file => fs.statSync(path.join(LOCALES_DIR, file)).isDirectory());
  
  // Test each locale
  const results = locales.filter(locale => locale !== REFERENCE_LOCALE).map(locale => {
    console.log(`\n📝 Testing ${locale}...`);
    
    const localeFile = path.join(LOCALES_DIR, locale, 'common.json');
    const translations = loadJSON(localeFile);
    if (!translations) return false;
    
    const flattenedTranslations = flattenObject(translations);
    const translationKeys = Object.keys(flattenedTranslations);
    
    const tests = [
      testMissingKeys(referenceKeys, locale, translationKeys),
      testExtraKeys(referenceKeys, locale, translationKeys),
      testPlaceholders(flattenedReference, flattenedTranslations, locale)
    ];
    
    return tests.every(Boolean);
  });
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`Total locales tested: ${results.length}`);
  console.log(`Passed: ${results.filter(Boolean).length}`);
  console.log(`Failed: ${results.filter(r => !r).length}`);
  
  process.exit(results.every(Boolean) ? 0 : 1);
}

runTests(); 