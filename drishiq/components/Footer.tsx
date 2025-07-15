'use client';

import React, { useState } from 'react';

interface FooterProps {
  variant?: 'full' | 'minimal';
  userType?: 'guest' | 'enterprise' | 'authenticated';
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ru', label: 'Russian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'mr', label: 'Marathi' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'ur', label: 'Urdu' },
  { code: 'kn', label: 'Kannada' },
];

const t = (key) => key;

const Footer: React.FC<FooterProps> = ({ variant = 'full', userType = 'guest' }) => {
  const currentLangNative = 'English';
  const [showLangModal, setShowLangModal] = useState(false);
  // Remove: const [selectedLang, setSelectedLang] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en');
  // Instead, get the current language from i18n context/provider.

  const openLanguageModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLangModal(true);
  };
  const closeLanguageModal = () => setShowLangModal(false);
  const selectLanguage = (code: string) => {
    // Remove: setSelectedLang(code);
    // Instead, update the language directly in the i18n context.
    // i18n.changeLanguage(code); // Instantly update UI language
    setShowLangModal(false);
  };

  return (
    <>
      <style jsx>{`
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          width: 32px;
          height: 32px;
          background-color: #FFFFFF;
          color: #0B4422;
          border-radius: 50%;
          font-size: 16px;
          text-decoration: none;
          margin: 0px 8px;
        }
      `}</style>
      
      <footer 
        className="fixed bottom-0 w-full text-center z-[1000]"
        style={{
          backgroundColor: '#0B4422', 
          color: 'white',
          padding: '0.8rem 0.6rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontWeight: '400',
          height: '70px'
        } as React.CSSProperties}
      >
        {/* Social Icons */}
        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'center' }}>
          <a href="#" className="social-icon">📘</a>
          <a href="#" className="social-icon">🔗</a>
          <a href="#" className="social-icon">📸</a>
        </div>
        
        {/* Links */}
        <p style={{ marginTop: '-5px' }}>
          <a href="#language" style={{fontSize: '12px', color: '#FFD700', textDecoration: 'none', position: 'relative' }}
            onClick={openLanguageModal}
            title="Change language"
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
            🌐 English
          </a>
          <span style={{ fontSize: '10px', padding: '0 4px', verticalAlign: 'middle' }}>|</span>
          <a href="/terms" style={{ fontSize: '12px', color: '#FFD700', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>Terms & Conditions / Privacy Policy</a>
        </p>
        
        {/* Contact */}
        <p style={{fontSize: '12px', marginTop: '-3px', marginBottom: '4px', color: 'white' }}>
          Contact: support@drishiq.com
        </p>
      </footer>
      {showLangModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-4 w-64 max-w-full text-sm">
            <h2 className="text-base font-bold mb-3 text-[#0B4422]">Select Language</h2>
            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {LANGUAGES.map(lang => (
                <li key={lang.code}>
                  <button
                    className={`w-full text-left px-3 py-1.5 rounded transition border ${i18n.language === lang.code ? 'bg-[#0B4422] text-white border-[#0B4422]' : 'bg-gray-100 text-gray-800 border-transparent'} hover:bg-[#0B4422] hover:text-white`}
                    onClick={() => selectLanguage(lang.code)}
                  >
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full py-1.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm" onClick={closeLanguageModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer; 