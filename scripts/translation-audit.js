const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SUPPORTED_LANGUAGES = [
  'en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'ar',
  'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'tl', 'my', 'km', 'lo', 'ne'
];

const PAGES_DIR = 'app';
const COMPONENTS_DIR = 'components';
const LOCALES_DIR = 'public/locales';

// Translation key patterns to look for
const TRANSLATION_PATTERNS = [
  /t\(['"`]([^'"`]+)['"`]\)/g,  // t('key')
  /t\(["`]([^"`]+)["`]\)/g,     // t("key")
  /useTranslation\(\)/g,        // useTranslation()
  /useLanguage\(\)/g            // useLanguage()
];

// Hardcoded text patterns to identify
const HARDCODED_PATTERNS = [
  /<[^>]*>([^<>{}\[\]()]+)<\/[^>]*>/g,  // HTML tags with text
  /['"`]([A-Z][^'"`\n]{10,})['"`]/g,    // Quoted strings starting with capital
  /className="[^"]*">([^<>{}\[\]()]{10,})</g  // Text in className elements
];

class TranslationAuditor {
  constructor() {
    this.missingKeys = new Set();
    this.existingKeys = new Set();
    this.hardcodedTexts = new Set();
    this.filesScanned = 0;
    this.issuesFound = 0;
  }

  // Load existing translation keys
  loadExistingKeys() {
    const enFile = path.join(LOCALES_DIR, 'en', 'master.json');
    if (fs.existsSync(enFile)) {
      const content = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      this.extractKeysFromObject(content, '');
    }
  }

  extractKeysFromObject(obj, prefix) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      this.existingKeys.add(fullKey);
      
      if (typeof value === 'object' && value !== null) {
        this.extractKeysFromObject(value, fullKey);
      }
    }
  }

  // Scan files for translation usage and hardcoded text
  scanFiles() {
    console.log('🔍 Scanning files for translation usage...');
    
    // Scan pages
    const pageFiles = glob.sync(`${PAGES_DIR}/**/*.{tsx,ts,js,jsx}`);
    pageFiles.forEach(file => this.scanFile(file));
    
    // Scan components
    const componentFiles = glob.sync(`${COMPONENTS_DIR}/**/*.{tsx,ts,js,jsx}`);
    componentFiles.forEach(file => this.scanFile(file));
    
    console.log(`📊 Scanned ${this.filesScanned} files`);
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.filesScanned++;
      
      // Check for translation usage
      this.checkTranslationUsage(content, filePath);
      
      // Check for hardcoded text
      this.checkHardcodedText(content, filePath);
      
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}:`, error.message);
    }
  }

  checkTranslationUsage(content, filePath) {
    TRANSLATION_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          this.existingKeys.add(match[1]);
        }
      }
    });
  }

  checkHardcodedText(content, filePath) {
    // Skip files that already use translation
    if (content.includes('useLanguage') || content.includes('useTranslation')) {
      return;
    }

    HARDCODED_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && match[1].length > 10) {
          this.hardcodedTexts.add({
            text: match[1].trim(),
            file: filePath
          });
        }
      }
    });
  }

  // Generate missing keys suggestions
  generateMissingKeys() {
    console.log('🔧 Generating missing translation keys...');
    
    this.hardcodedTexts.forEach(item => {
      const key = this.generateKeyFromText(item.text);
      if (!this.existingKeys.has(key)) {
        this.missingKeys.add({
          key,
          text: item.text,
          file: item.file
        });
      }
    });
  }

  generateKeyFromText(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }

  // Generate report
  generateReport() {
    console.log('\n📋 TRANSLATION AUDIT REPORT');
    console.log('=' .repeat(50));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`- Files scanned: ${this.filesScanned}`);
    console.log(`- Existing translation keys: ${this.existingKeys.size}`);
    console.log(`- Missing translation keys: ${this.missingKeys.size}`);
    console.log(`- Hardcoded texts found: ${this.hardcodedTexts.size}`);
    
    if (this.missingKeys.size > 0) {
      console.log(`\n🔍 MISSING TRANSLATION KEYS:`);
      this.missingKeys.forEach(item => {
        console.log(`- ${item.key}: "${item.text}" (in ${item.file})`);
      });
    }
    
    if (this.hardcodedTexts.size > 0) {
      console.log(`\n⚠️  HARDCODED TEXTS FOUND:`);
      this.hardcodedTexts.forEach(item => {
        console.log(`- "${item.text}" (in ${item.file})`);
      });
    }
  }

  // Generate translation files
  generateTranslationFiles() {
    console.log('\n📝 Generating translation files...');
    
    // Create missing keys in English file
    this.addMissingKeysToEnglish();
    
    // Generate other language files
    SUPPORTED_LANGUAGES.forEach(lang => {
      if (lang !== 'en') {
        this.generateLanguageFile(lang);
      }
    });
  }

  addMissingKeysToEnglish() {
    const enFile = path.join(LOCALES_DIR, 'en', 'master.json');
    const content = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    
    this.missingKeys.forEach(item => {
      this.addKeyToObject(content, item.key, item.text);
    });
    
    fs.writeFileSync(enFile, JSON.stringify(content, null, 2));
    console.log(`✅ Added ${this.missingKeys.size} keys to English file`);
  }

  addKeyToObject(obj, key, value) {
    const parts = key.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  generateLanguageFile(lang) {
    const enFile = path.join(LOCALES_DIR, 'en', 'master.json');
    const langFile = path.join(LOCALES_DIR, lang, 'master.json');
    
    const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    let langContent = {};
    
    if (fs.existsSync(langFile)) {
      langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'));
    }
    
    // Merge missing keys (keeping existing translations)
    this.mergeTranslationObjects(enContent, langContent);
    
    fs.writeFileSync(langFile, JSON.stringify(langContent, null, 2));
    console.log(`✅ Updated ${lang} translation file`);
  }

  mergeTranslationObjects(enObj, langObj) {
    for (const [key, value] of Object.entries(enObj)) {
      if (typeof value === 'object' && value !== null) {
        if (!langObj[key]) {
          langObj[key] = {};
        }
        this.mergeTranslationObjects(value, langObj[key]);
      } else {
        if (!langObj[key]) {
          langObj[key] = `[${key}]`; // Placeholder for missing translation
        }
      }
    }
  }

  // Run complete audit
  run() {
    console.log('🚀 Starting Translation Audit...\n');
    
    this.loadExistingKeys();
    this.scanFiles();
    this.generateMissingKeys();
    this.generateReport();
    
    if (this.missingKeys.size > 0) {
      console.log('\n❓ Would you like to generate missing translation keys? (y/n)');
      // In a real implementation, you'd wait for user input
      // For now, we'll auto-generate
      this.generateTranslationFiles();
    }
    
    console.log('\n✅ Translation audit completed!');
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new TranslationAuditor();
  auditor.run();
}

module.exports = TranslationAuditor; 