import { useEffect, useRef, useState } from 'react';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set current language statically
  const currentLang = 'en';
  const currentLangInfo = { nativeName: 'English', name: 'en' };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Change language handler (no-op)
  const changeLanguage = async (lang: string) => {
    setIsOpen(false);
  };

  // Group languages by script type for better organization
  const languageGroups: Record<string, string[]> = {
    latin: ['en', 'fr', 'es', 'pt', 'it', 'nl', 'tr'],
    cjk: ['zh', 'ja', 'ko'],
    indic: ['hi', 'bn', 'ta', 'te', 'mr'],
    rtl: ['ar', 'ur'],
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current language button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
      >
        <span>{currentLangInfo.nativeName}</span>
        <span className="text-gray-500">({currentLangInfo.name})</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Language dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-56 rounded-lg shadow-lg bg-white border border-gray-200 py-2 z-50">
          {Object.entries(languageGroups).map(([group, langs]) => (
            <div key={group} className="px-3 py-2">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                {group === 'latin' ? 'Latin Script' :
                 group === 'cjk' ? 'CJK Scripts' :
                 group === 'indic' ? 'Indic Scripts' : 'RTL Scripts'}
              </div>
              {langs.map((lang) => {
                const langInfo = { nativeName: lang, name: lang };
                return (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={``}
                  >
                    {langInfo.nativeName} ({langInfo.name})
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}