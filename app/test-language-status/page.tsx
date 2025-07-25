'use client';

import { SUPPORTED_LANGUAGES, useLanguage } from '@/lib/drishiq-i18n';
import { useState } from 'react';

export default function TestLanguageStatus() {
  const { t, locale, setLocale } = useLanguage();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const testKeys = [
    'footer.select_language',
    'dashboard.welcome_message',
    'about.heading',
    'areas.heading',
    'blog.heading'
  ];

  const testLanguage = (langCode: string) => {
    const originalLocale = locale;
    setLocale(langCode);
    
    // Wait a bit for translations to load
    setTimeout(() => {
      const results = testKeys.map(key => {
        const translation = t(key);
        return {
          key,
          hasTranslation: translation !== '' && translation !== key,
          translation
        };
      });
      
      const allWorking = results.every(r => r.hasTranslation);
      setTestResults(prev => ({ ...prev, [langCode]: allWorking }));
      
      // Restore original locale
      setLocale(originalLocale);
    }, 1000);
  };

  const testAllLanguages = () => {
    SUPPORTED_LANGUAGES.forEach(lang => {
      testLanguage(lang.code);
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Language Status Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={testAllLanguages}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test All Languages
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_LANGUAGES.map(lang => (
          <div 
            key={lang.code}
            className={`p-4 border rounded ${
              testResults[lang.code] === true 
                ? 'bg-green-100 border-green-500' 
                : testResults[lang.code] === false 
                ? 'bg-red-100 border-red-500'
                : 'bg-gray-100 border-gray-300'
            }`}
          >
            <h3 className="font-bold">{lang.name}</h3>
            <p className="text-sm">Code: {lang.code}</p>
            <p className="text-sm">
              Status: {
                testResults[lang.code] === true 
                  ? '✅ Working' 
                  : testResults[lang.code] === false 
                  ? '❌ Not Working'
                  : '⏳ Not Tested'
              }
            </p>
            <button 
              onClick={() => testLanguage(lang.code)}
              className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Test Now
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Current Language Test</h2>
        <p>Current locale: {locale}</p>
        {testKeys.map(key => (
          <div key={key} className="mb-2">
            <strong>{key}:</strong> "{t(key)}"
          </div>
        ))}
      </div>
    </div>
  );
} 