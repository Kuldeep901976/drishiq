'use client';

import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    document.getElementById('dropdownMenu')?.classList.toggle('show');
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            padding-top: 2.5rem;
          }
          
          header {
            background-color: #F5FAF6;
            color: #0B4422;
            padding: 0.6rem 0.6rem;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
            align-items: flex-start;
            margin-top: 18px;
            margin-right: 0px;
            flex: 1;
          }
          
          .logo-section .subtext {
            font-size: 0.85rem;
            color: #0B4422;
            margin-top: 0.2rem;
          }
          
          .button-container {
            margin-right: -186px;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
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
          
          .nav-links {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            flex: 3.6;
          }
          
          .nav-links a {
            color: #0B4422;
            text-decoration: none;
            font-weight: 500;
            margin-top: 56px;
            font-size: 0.95rem;
          }
          
          .profile-icon-container {
            margin-top: 36px;
            margin-right: 24px;
            margin-left: 124px;
            background-color: white;
            border: 2px solid #0B4422;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .profile-icon {
            position: relative;
            width: 24px;
            height: 24px;
            fill: #0B4422;
            cursor: pointer;
          }
          
          .dropdown-menu {
            display: none;
            position: absolute;
            right: 0;
            top: 40px;
            background-color: #ffffff;
            color: #0B4422;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 999;
            width: 100%;
            max-width: 300px;
            min-width: 260px;
            max-height: 400px;
            overflow-y: auto;
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
            background: #fff;
            border-radius: 8px;
            margin: 2px 10px;
            box-shadow: 2px 2px 6px rgba(0,0,0,0.08);
          }
          
          .dropdown-item-content {
            display: flex;
            align-items: center;
            color: #0B4422;
            flex: 1;
          }
          
          .dropdown-item-content i {
            margin-right: 12px;
          }
          
          .dropdown-item::after {
            content: '>';
            font-weight: bold;
            margin-left: 12px;
            color: #0B4422;
          }
          
          .dropdown-item:hover {
            background-color: #f0f0f0;
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
            color: #0B4422;
          }
        `
      }} />

      <header>
        <div className="header-container">
          {/* Logo + Subtext (Left) */}
          <div className="logo-section">
            <img src="/assets/logo/Logo.png" alt="DrishiQ Logo" style={{ width: '120px', height: '36px' }} />
            <span className="subtext">Intelligence of Perception</span>
          </div>

          {/* Nav Links (Center) */}
          <nav className="nav-links">
            <a href="#">  DrishiQ ?    |</a>
            <a href="#">  Support us    |</a>
            <a href="#">  Our plans & pricing    |</a>
            <a href="#">  Blog    |</a>
            <a href="#">  Testimonial    |</a>
          </nav>

          <div className="button-container">
            <a href="/sessions" className="button">Start Session</a>
          </div>

          <div className="profile-icon-container">
            <div className="profile-icon" onClick={toggleDropdown}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0B4422">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM12 7C14.21 7 16 8.79 16 11C16 13.21 14.21 15 12 15C9.79 15 8 13.21 8 11C8 8.79 9.79 7 12 7ZM6 19C6 16.33 9.33 14.5 12 14.5C14.67 14.5 18 16.33 18 19V20H6V19Z"/>
              </svg>
            </div>
            
            <div id="dropdownMenu" className="dropdown-menu">
              <div className="qr-code">
                <img 
                  src="https://jfguztmagsdsunhychkl.supabase.co/storage/v1/object/sign/projectimages/QR%20code.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mNjQ1YWM5OS03MjJiLTQ4NWYtYTcwYy0xYTUyZGRiMGZlMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9qZWN0aW1hZ2VzL1FSIGNvZGUucG5nIiwiaWF0IjoxNzUwOTMzODkyLCJleHAiOjE4MzczMzM4OTJ9.d3gowv3zKoHXO2QkL74hyLmu2i4hol9RSsLe8rvPRbc" 
                  alt="QR Code" 
                  onClick={() => alert('Expand QR logic here')} 
                />
                <div><i className="fas fa-qrcode"></i> Signup URL</div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-adjust"></i> Theme Toggle
                </div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-user-edit"></i> Enrich Your Profile
                </div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-credit-card"></i> Plans & Payments
                </div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-key"></i> Reset Password
                </div>
              </div>
              <div className="dropdown-item">
                <div className="dropdown-item-content">
                  <i className="fas fa-info-circle"></i> About DrishiQ
                </div>
              </div>
              <div className="dropdown-item">
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