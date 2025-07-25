'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SUPPORTED_LANGUAGES, useLanguage } from '../lib/drishiq-i18n';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  // Try to use context if available, fallback to local state if not
  let context;
  try {
    context = useLanguage();
  } catch {
    context = null;
  }
  const t = context ? context.t : (key: string) => key;
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('drishiq-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldUseDark);
    applyTheme(shouldUseDark);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('lang-dropdown');
      const button = document.getElementById('lang-btn');
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        setShowLangDropdown(false);
      }
    };
    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangDropdown]);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('drishiq-theme', newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  };

  const handleLogout = () => {
    console.log('User logging out...');
    // router.push('/login');
  };

  const handlePlansClick = () => {
    router.push('/priceplan-enhanced');
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault(); // ⛔ stop native jump
    const section = document.getElementById('about');
    if (section) {
      const offset = 80;
      const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --drishiq-bg-primary: #F5FAF6;
            --drishiq-bg-secondary: #ffffff;
            --drishiq-text-primary: #0B4422;
            --drishiq-text-secondary: #166534;
            --drishiq-border: rgba(11, 68, 34, 0.2);
            --drishiq-shadow: rgba(0, 0, 0, 0.1);
            --drishiq-hover: #f0f0f0;
          }

          .dark-theme {
            --drishiq-bg-primary: #1a1a1a;
            --drishiq-bg-secondary: #2d2d2d;
            --drishiq-text-primary: #e0e0e0;
            --drishiq-text-secondary: #b0b0b0;
            --drishiq-border: rgba(224, 224, 224, 0.2);
            --drishiq-shadow: rgba(0, 0, 0, 0.3);
            --drishiq-hover: #3a3a3a;
          }

          .light-theme {
            --drishiq-bg-primary: #F5FAF6;
            --drishiq-bg-secondary: #ffffff;
            --drishiq-text-primary: #0B4422;
            --drishiq-text-secondary: #166534;
            --drishiq-border: rgba(11, 68, 34, 0.2);
            --drishiq-shadow: rgba(0, 0, 0, 0.1);
            --drishiq-hover: #f0f0f0;
          }

          .drishiq-header {
            background-color: var(--drishiq-bg-primary);
            color: var(--drishiq-text-primary);
            padding: 0.6rem 0.2rem;
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 4px var(--drishiq-shadow);
            font-family: 'Segoe UI', sans-serif;
            transition: all 0.3s ease;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            padding: 0 2rem;
          }

          .logo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 18px;
            margin-right: 0px;
            flex: 1;
          }

          .logo-section .subtext {
            font-size: 0.875rem;
            color: var(--drishiq-text-primary);
            margin-top: -0.5rem;
            opacity: 0.7;
          }

          .nav-links {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            flex: 3.6;
          }

          .nav-links a {
            color: var(--drishiq-text-primary);
            text-decoration: none;
            font-weight: 500;
            margin-top: 56px;
            font-size: 0.95rem;
            transition: color 0.3s ease;
          }

          .button-container {
            margin-right: -186px;
            background-color: var(--drishiq-bg-secondary);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s ease;
          }

          .button {
            background-color: #0B4422;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
          }

          .social-profile {
            display: flex;
            flex-direction: column;
            align-items: flex-center;
            flex: 1;
          }

          .profile-icon-container {
            margin-top: 36px;
            margin-right: 24px;
            margin-left: 124px;
            background-color: var(--drishiq-bg-secondary);
            border: 2px solid var(--drishiq-text-primary);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            transition: all 0.3s ease;
          }

          .profile-icon {
            position: relative;
            width: 24px;
            height: 24px;
            fill: var(--drishiq-text-primary);
            cursor: pointer;
            transition: fill 0.3s ease;
          }

          .dropdown-menu {
            display: none;
            position: absolute;
            right: 0;
            top: 40px;
            background-color: var(--drishiq-bg-secondary);
            color: var(--drishiq-text-primary);
            box-shadow: 0 4px 8px var(--drishiq-shadow);
            border-radius: 10px;
            z-index: 999;
            width: 100%;
            max-width: 300px;
            min-width: 260px;
            max-height: 400px;
            overflow-y: auto;
            transition: all 0.3s ease;
          }

          .dropdown-menu.show {
            display: block;
          }

          .dropdown-item {
            padding: 12px 20px;
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--drishiq-bg-secondary);
            border-radius: 8px;
            margin: 2px 10px;
            box-shadow: 2px 2px 6px var(--drishiq-shadow);
            transition: all 0.3s ease;
          }

          .dropdown-item-content {
            display: flex;
            align-items: center;
            color: var(--drishiq-text-primary);
            flex: 1;
          }

          .dropdown-item-content i {
            margin-right: 12px;
          }

          .dropdown-item::after {
            content: '>';
            font-weight: bold;
            margin-left: 12px;
            color: var(--drishiq-text-primary);
          }

          .dropdown-item:hover {
            background-color: var(--drishiq-hover);
          }

          .theme-toggle-text {
            font-size: 0.8rem;
            color: var(--drishiq-text-secondary);
            margin-left: auto;
            margin-right: 8px;
          }

          .qr-code {
            text-align: center;
            padding: 1rem 1rem 1px 1rem;
          }

          .qr-code img {
            width: 70px;
            height: 70px;
            object-fit: cover;
            cursor: pointer;
            border-radius: 8px;
          }

          .qr-code div {
            padding-top: 1px;
            font-size: 0.85rem;
            color: var(--drishiq-text-primary);
          }
        `
      }} />

      <header className="drishiq-header">
        <div className="header-container">
          {/* Logo + Subtext (Left) */}
          <div className="logo-section">
            <Image 
              src="/assets/logo/Logo.png" 
              alt="DrishiQ Logo" 
              width={160} 
              height={36}
              className="mb-1"
            />
            <span className="subtext -mt-2">{t('header.subtext')}</span>
          </div>

          {/* Nav Links (Center) */}
          <nav className="nav-links">
            <a href="#about">{t('header.nav.drishiq')}</a>
            <a href="/priceplan-enhanced">{t('header.nav.plans')}</a>
            <a href="#support-privilege">{t('header.nav.support')}</a>
            <a href="#blog-insights">{t('header.nav.blog')}</a>
            <a href="#testimonials-usersay">{t('header.nav.testimonials')}</a>
            <a href="#clarity-anchor">{t('header.nav.anchor')}</a>
          </nav>

          <div className="button-container">
            <button
              id="lang-btn"
              className="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: '2px solid #0B4422',
                color: '#0B4422',
                boxShadow: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '20px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => setShowLangDropdown((v) => !v)}
            >
              <span role="img" aria-label="language">🌐</span> {context ? (SUPPORTED_LANGUAGES.find(l => l.code === context.locale)?.name || t('header.language.english')) : selectedLanguage.name}
            </button>
            {showLangDropdown && (
              <div
                id="lang-dropdown"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: 'white',
                  border: '1.5px solid #0B4422',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  zIndex: 1001,
                  minWidth: '180px',
                  padding: '0.25rem 0',
                  maxHeight: '350px',
                  overflowY: 'auto',
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    style={{
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      color: '#0B4422',
                      fontWeight: (context ? context.locale : selectedLanguage.code) === lang.code ? 700 : 400,
                      background: (context ? context.locale : selectedLanguage.code) === lang.code ? '#F5FAF6' : 'transparent',
                    }}
                    onClick={() => {
                      if (context) {
                        context.setLocale(lang.code);
                      } else {
                        setSelectedLanguage(lang);
                      }
                      setShowLangDropdown(false);
                    }}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-icon-container">
            <div 
              className="profile-icon" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0B4422">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM12 7C14.21 7 16 8.79 16 11C16 13.21 14.21 15 12 15C9.79 15 8 13.21 8 11C8 8.79 9.79 7 12 7ZM6 19C6 16.33 9.33 14.5 12 14.5C14.67 14.5 18 16.33 18 19V20H6V19Z"/>
              </svg>
            </div>

            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <div className="qr-code">
                <Image 
                  src="/assets/other-Icons/qr-code.png" 
                  alt={t('header.qr.alt')} 
                  width={70}
                  height={70}
                  style={{ cursor: 'pointer', borderRadius: '8px' }}
                  onClick={() => alert('Expand QR logic here')} 
                />
                <div><i className="fas fa-qrcode"></i> {t('header.qr.signup')}</div>
              </div>
              <div className="dropdown-item" onClick={handleThemeToggle}>
                <div className="dropdown-item-content">
                  <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i> 
                  {t('header.dropdown.theme')}
                </div>
                <span className="theme-toggle-text">
                  {isDarkMode ? t('header.dropdown.dark') : t('header.dropdown.light')}
                </span>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-user-edit"></i> {t('header.dropdown.enrichProfile')}
                </div>
              </div>
              <div className="dropdown-item" onClick={handlePlansClick}>
                <div className="dropdown-item-content">
                  <i className="fas fa-credit-card"></i> {t('header.dropdown.plansPayments')}
                </div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-key"></i> {t('header.dropdown.resetPassword')}
                </div>
              </div>
              <div className="dropdown-item" onClick={handleAboutClick}>
                <div className="dropdown-item-content">
                  <i className="fas fa-info-circle"></i> {t('header.dropdown.about')}
                </div>
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <div className="dropdown-item-content">
                  <i className="fas fa-sign-out-alt"></i> {t('header.dropdown.logout')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header; 