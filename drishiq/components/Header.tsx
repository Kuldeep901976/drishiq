'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const t = (key: string) => key;

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('drishiq-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldUseDark);
    applyTheme(shouldUseDark);
  }, []);

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
            <span className="subtext -mt-2">Intelligence of Perception</span>
          </div>

          {/* Nav Links (Center) */}
          <nav className="nav-links">
            <a href="#about">DrishiQ</a>
            <a href="#support">Support</a>
            <a href="/priceplan-enhanced">Our Plans</a>
            <a href="#blog">Blog</a>
            <a href="#testimonials">Testimonials</a>
          </nav>

          <div className="button-container">
            <a href="/invitation" className="button">Start Session</a>
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
                  alt="QR Code" 
                  width={70}
                  height={70}
                  style={{ cursor: 'pointer', borderRadius: '8px' }}
                  onClick={() => alert('Expand QR logic here')} 
                />
                <div><i className="fas fa-qrcode"></i> Signup URL</div>
              </div>
              <div className="dropdown-item" onClick={handleThemeToggle}>
                <div className="dropdown-item-content">
                  <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i> 
                  Theme
                </div>
                <span className="theme-toggle-text">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-user-edit"></i> Enrich Profile
                </div>
              </div>
              <div className="dropdown-item" onClick={handlePlansClick}>
                <div className="dropdown-item-content">
                  <i className="fas fa-credit-card"></i> Plans & Payments
                </div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-key"></i> Reset Password
                </div>
              </div>
              <div className="dropdown-item" onClick={handleAboutClick}>
                <div className="dropdown-item-content">
                  <i className="fas fa-info-circle"></i> About DrishiQ
                </div>
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <div className="dropdown-item-content">
                  <i className="fas fa-sign-out-alt"></i> Log Out
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