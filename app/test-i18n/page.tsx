'use client';

import { LanguageProvider, useLanguage } from '../../lib/drishiq-i18n';

function TestContent() {
  const { t, locale, setLocale, isLoading } = useLanguage();

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>i18n Test Page</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Current Language: {locale}</h2>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <button 
          onClick={() => setLocale('hi')}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          Switch to Hindi
        </button>
        <button 
          onClick={() => setLocale('es')}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          Switch to Spanish
        </button>
        <button 
          onClick={() => setLocale('en')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Switch to English
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3>Test Translations:</h3>
        <p><strong>Welcome:</strong> "{t('landing.welcomeBack')}"</p>
        <p><strong>Experience Button:</strong> "{t('experience_button')}"</p>
        <p><strong>Typewriter 1:</strong> "{t('typewriter1')}"</p>
        <p><strong>Dashboard Welcome:</strong> "{t('dashboard.welcome_message')}"</p>
        <p><strong>Footer Select Language:</strong> "{t('footer.select_language')}"</p>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Info:</h3>
        <p>Locale: {locale}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Test direct key: {t('500')}</p>
        <p>Test nested key: {t('footer.select_language')}</p>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <LanguageProvider>
      <TestContent />
    </LanguageProvider>
  );
} 