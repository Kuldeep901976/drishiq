'use client';

import React from 'react';
import { useLanguage } from '../lib/drishiq-i18n';

interface FooterProps {
  variant?: 'full' | 'minimal';
  userType?: 'guest' | 'enterprise' | 'authenticated';
}

const Footer: React.FC<FooterProps> = ({ variant = 'full', userType = 'guest' }) => {
  const { t } = useLanguage();
  // Remove any modal or dropdown for language selection, keep only static footer links and info.

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
          <a href="#" className="social-icon">
            <img 
              src="/assets/social-icons/linkedin.png" 
              alt={t('footer.social.linkedin')} 
              style={{ width: '32px', height: '32px' }}
            />
          </a>
          <a href="#" className="social-icon">
            <img 
              src="/assets/social-icons/facebook.png" 
              alt={t('footer.social.facebook')} 
              style={{ width: '32px', height: '32px' }}
            />
          </a>
          <a href="#" className="social-icon">
            <img 
              src="/assets/social-icons/youtube.png" 
              alt={t('footer.social.youtube')} 
              style={{ width: '24px', height: '24px' }}
            />
          </a>
        </div>
        
        {/* Links */}
        <p style={{ marginTop: '-5px' }}>
          <a href="/terms" style={{ fontSize: '12px', color: '#FFD700', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>{t('footer.terms')}</a>
        </p>
        
        {/* Contact */}
        <p style={{fontSize: '12px', marginTop: '-3px', marginBottom: '4px', color: 'white' }}>
          {t('footer.contact')}
        </p>
      </footer>
    </>
  );
};

export default Footer; 