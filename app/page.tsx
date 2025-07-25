'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LandingBlogCards from '../components/LandingBlogCards';
import { LanguageProvider, useLanguage } from '../lib/drishiq-i18n';

function HomePageContent() {
  const [animationStage, setAnimationStage] = useState(0);
  const router = useRouter();
  const { t, isLoading } = useLanguage();

  // Handle hash navigation for about section
  useEffect(() => {
    if (window.location.hash === '#about') {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          aboutSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 0),
      setTimeout(() => setAnimationStage(2), 1500),
      setTimeout(() => setAnimationStage(3), 3000),
      setTimeout(() => setAnimationStage(4), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (isLoading) return null;

  const handleExperienceClick = () => {
    router.push('/sessions');
  };

  return (
    <>
      <Header />
      <div className="flex-grow pt-20">
        <style jsx>{`
          .container {
            max-width: 1100px;
            margin: auto;
            padding: 2rem;
          }

          .section {
            padding: 3rem 2rem;
          }

          .section-title {
            font-size: 2rem;
            margin-bottom: 0.2rem;
            text-align: center;
          }

          .motivational-container {
            position: relative;
            text-align: center;
            max-height: 120px;
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .typewriter {
            position: relative;
            font-size: 1.2rem;
            white-space: nowrap;
            opacity: 0;
            margin-bottom: 2px;
            animation: fadeIn 0.8s ease-out forwards;
          }

          .line1 {
            animation-delay: 0s;
            color: #000080;
            font-size:18px;
            font-weight:300;
            margin-top: -64px;
          }

          .line2 {
            animation-delay: 1s;
            font-size:18px;
            font-weight:300;
            color: #0B4422;
            margin-top: -5px;
          }

          .line3 {
            animation-delay: 2s;
            color: #000080;
            font-size:18px;
            font-weight:500;
            margin-top: -5px;
            margin-bottom: 8px;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .glow-button {
            display: inline-block;
            opacity: 0;
            margin-top: 0px;
            padding: 0.6rem 1.2rem;
            font-size: 1rem;
            background-color: #0B4422;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 20px;
            animation: glow 1.5s ease-in-out infinite alternate, fadeIn 0.5s ease forwards;
            animation-delay: 2s, 2s;
          }

          @keyframes glow {
            0% {
              box-shadow: 0 0 5px #0B442280, 0 0 10px #0B442240;
            }
            100% {
              box-shadow: 0 0 12px #0B4422cc, 0 0 20px #0B4422;
            }
          }

          .hero-section {
            background: linear-gradient(#092e18, #F2F2F2);
            max-height: 420px;
            background-size: cover;
            background-position: center;
            color: #FFFFFF;
            text-align: center;
            padding: 5rem 1rem;
            margin-top: 24px;
          }

          .features-grid, .blog-grid {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .card {
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
          }

          .card img {
            width: 100%;
            height: 180px;
            object-fit: cover;
          }

          .card-content {
            padding: 1rem;
          }

          .features-cards .card:nth-child(odd) {
            background-color: #ffffff;
            transform: translateY(-5px);
            border: 1px solid #cce4d1;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }

          .features-cards .card:hover {
            background-color: #ffffff;
            border: 1px solid #cce4d1;
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }

          .glow-button1 {
            display: inline-block;
            opacity: 0;
            margin-top: 40px;
            padding: 0.6rem 1.2rem;
            font-size: 1rem;
            background-color: #0B4422;
            display: inline-block;
            opacity: 0;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 20px;
            animation: glow 1.5s ease-in-out infinite alternate, fadeIn 0.5s ease forwards;
            animation-delay: 2s, 2s;
          }

            .testimonial {
            font-style: italic;
            background: #f0f0f0;
            border-left: 4px solid #0B4422;
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .cta-section {
            text-align: center;
            background-color: #F2F2F2;
            color: #0B4422;
            padding: 3rem 1rem;
          }

          .button {
            display: inline-block;
            background: #0B4422;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 20px;
            font-weight: bold;
            text-decoration: none;
            transition: background-color 0.3s ease;
          }

          .button:hover {
            background-color: #083318;
          }

          .animated-arrow {
            display: inline-block;
            margin-left: 6px;
            animation: arrowMove 0.8s ease-in-out infinite alternate;
          }

          @keyframes arrowMove {
            from { transform: translateX(0); }
            to { transform: translateX(6px); }
          }

          .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0B4422;
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(45deg, #0B4422, #22c55e);
          border-radius: 2px;
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .area-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          border-radius: 20px;
          border-left: 5px solid #0B4422;
          font-style: italic;
          font-size: 1.1rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .area-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0B4422, #166534);
          transition: left 0.4s ease;
          z-index: -1;
        }

        .area-card:hover {
          transform: translateX(15px) scale(1.02);
          color: white;
          border-left-color: #22c55e;
          box-shadow: 0 15px 35px rgba(11, 68, 34, 0.3);
        }

        .area-card:hover::before {
          left: 0;
        }
        `}</style>

        {/* Hero Section with Typewriter Animation */}
        <div className="motivational-container" style={{ marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
          <p className="typewriter line1 show">
            <strong>{t('motivational.line1')}</strong>
          </p>
          <p className="typewriter line2 show">
            <strong>{t('motivational.line2')}</strong>
          </p>
          <p className="typewriter line3 show">
            <strong>{t('motivational.line3')}</strong>
          </p>
          <button onClick={() => router.push('/invitation')} className="glow-button" style={{ marginBottom: '8px', position: 'relative', zIndex: 15 }}>
            ✨ {t('motivational.experience_button')}
          </button>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <BannerCarousel />
        </div>
        {/* About Section */}
        <section id="about" className="section" style={{ 
          background: '#fff',
          marginBottom: '-30px',
          paddingTop: 'calc(3rem - 20px)',
          paddingBottom: 'calc(3rem - 20px)',
          scrollMarginTop: '80px'
        }}>
          <div className="container">
            <h2 className="section-title" style={{ marginTop: '-2.5rem', color: '#0B4422' }}>
              <span 
                onClick={() => router.push('/invitation')} 
                style={{ 
                  cursor: 'pointer', 
                  color: '#0B4422',
                  textDecoration: 'underline',
                  textDecorationColor: 'transparent',
                  transition: 'text-decoration-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#0B4422'}
                onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
              >
                {t('about.heading')}
              </span>
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{t('about.description1')}</p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{t('about.description2')}</p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              {t('about.description3.prefix')} 🌟 
              <button 
                onClick={() => router.push('/invitation')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#0B4422', 
                  fontWeight: '700', 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  padding: '0',
                  margin: '0 0.5rem'
                }}
              >
                {t('about.join_button')}
              </button>
              {t('about.description3.suffix')}
            </p>
          </div>
        </section>

        <section className="section" style={{ 
          background: '#f5f5f5', 
          marginTop: '-2rem', 
          paddingTop: '2rem', 
          paddingBottom: '2rem',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            textAlign: 'center',
            position: 'relative',
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            <h2 className="section-title" style={{marginBottom: '2rem', color: '#0B4422'}}>{t('areas.heading')}</h2>
            {/* Areas Slider Container */}
            <div style={{
              position: 'relative',
              maxWidth: '1400px',
              margin: '0 auto',
              overflow: 'hidden',
              width: '100%'
            }}>
              <style>{`
                .areas-slider-custom {
                  display: flex;
                  gap: 1.5rem;
                  width: max-content;
                  animation: slideLeftCustom 32s linear infinite;
                }
                .areas-slider-custom:hover {
                  animation-play-state: paused;
                }
                @keyframes slideLeftCustom {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .area-card-custom {
                  width: 350px;
                  height: 280px;
                  flex-shrink: 0;
                  cursor: pointer;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  position: relative;
                  background: #ffffff;
                  border-radius: 12px;
                  border: 1px solid rgba(0,0,0,0.08);
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
                  padding: 2.5rem;
                }
              `}</style>
              <div className="areas-slider-custom">
                {/* Card 1 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>🔁</span>
                    {t('areas.card1.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card1.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card1.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>🔎</span>
                    {t('areas.card2.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card2.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card2.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>🎯</span>
                    {t('areas.card3.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card3.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card3.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 4 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>🎾</span>
                    {t('areas.card4.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card4.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card4.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 5 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>💔</span>
                    {t('areas.card5.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card5.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card5.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 6 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>🎓</span>
                    {t('areas.card6.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card6.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card6.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 7 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>💸</span>
                    {t('areas.card7.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card7.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card7.quote2')}
                    </p>
                  </div>
                </div>
                {/* Card 8 */}
                <div className="area-card-custom">
                  <h3 style={{marginBottom: '1.5rem', color: '#0B4422', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em'}}>
                    <span style={{fontSize: '1.8rem', opacity: 0.9}}>🌐</span>
                    {t('areas.card8.title')}
                  </h3>
                  <div style={{fontSize: '1rem', lineHeight: '1.7', color: '#4b5563', fontWeight: 400}}>
                    <p style={{marginBottom: '1rem', fontStyle: 'italic', color: '#0B4422', opacity: 0.9, fontWeight: 500}}>
                      {t('areas.card8.quote1')}
                    </p>
                    <p style={{fontStyle: 'italic', color: '#6b7280'}}>
                      {t('areas.card8.quote2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', color: '#0B4422', fontStyle: 'italic' }}>
              {t('areas.not_seeing_challenge')} 
              <span onClick={() => router.push('/invitation')} style={{ 
                color: '#0B4422', 
                fontWeight: '700', 
                textDecoration: 'underline', 
                marginLeft: '0.5rem', 
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>
                🔗 {t('areas.start_now')}
              </span>
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ background: '#fff', padding: '0.1rem 0' }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: '3rem' }}>
              {t('features.heading')}
            </h2>

            <div className="features-grid">
              <div className="card">
                <div className="card-content">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem', color: '#0B4422' }}>
                    🧠 {t('features.card1.title')}
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151' }}>
                    {t('features.card1.description')}
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem', color: '#0B4422' }}>
                    🤝 {t('features.card2.title')}
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151' }}>
                    {t('features.card2.description')}
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem', color: '#0B4422' }}>
                    🌍 {t('features.card3.title')}
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151' }}>
                    {t('features.card3.description')}
                  </p>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', color: '#0B4422', fontStyle: 'italic' }}>
              {t('features.cta_description')}
            </p>

            <p style={{ textAlign: 'center', marginTop: '3rem' }}>
              {t('features.try_now_cta')} <span onClick={() => router.push('/invitation')} className="button" style={{ cursor: 'pointer' }}>{t('features.try_now_button')}</span>
            </p>
          </div>
        </section>

        {/* Support Section */}
        <section id="support-privilege" className="section" style={{ background: '#f5f5f5', marginBottom: '0', textAlign: 'center', color: '#0B4422', padding: '3rem 1rem', scrollMarginTop: '80px' }}>
          <div className="container">
            <h2
              className="section-title"
              style={{ marginTop: '-2.5rem', marginBottom: '2.5rem', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.3s' }}
              onClick={() => router.push('/support-details')}
              onMouseEnter={e => (e.currentTarget.style.textDecorationColor = '#0B4422')}
              onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
            >
              {t('support.heading')}
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '2rem' }}>
              {t('support.description')}
            </p>

            <div style={{
              maxWidth: '1000px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              marginTop: '3rem'
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%'
              }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#0B4422', fontWeight: '600' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 300, color: '#1a1a1a', display: 'block', marginBottom: '1rem', lineHeight: '1.6' }}>
                      🫖 {t('support.chai_seller_story')}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 300, color: '#1a1a1a', display: 'block', marginBottom: '1rem', lineHeight: '1.6' }}>
                      🛡️ {t('support.security_guard_story')}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 300, color: '#1a1a1a', display: 'block', marginBottom: '1rem', lineHeight: '1.6' }}>
                      🎓 {t('support.college_student_story')}
                    </span>
                </p>
                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#374151' }}>
                  {t('support.not_looking_for_sympathy')}
                </p>
              </div>
            </div>

            <p style={{
              fontSize: '1.2rem',
              color: '#374151',
              marginTop: '2rem',
              marginBottom: '2rem',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {t('support.sponsorship_description')}
            </p>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <h3 style={{
                fontSize: '1.8rem',
                color: '#0B4422',
                marginBottom: '1rem',
                fontWeight: '700'
              }}>
                🎁 {t('support.sponsor_moment_heading')}
              </h3>
              <button
                onClick={() => router.push('/support-details')}
                className="glow-button"
                style={{
                  fontSize: '1.1rem',
                  padding: '0.8rem 1.5rem',
                  marginTop: '0.5rem',
                  background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
                  color: '#0B4422',
                  border: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  fontWeight: 600
                }}
              >
                🔗 {t('support.become_supporter')}
              </button>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog-insights" className="section" style={{ background: '#fff', padding: '3rem 2rem', scrollMarginTop: '80px' }}>
          <div className="container">
            <h2
              className="section-title"
              style={{ marginTop: '-2.5rem', marginBottom: '2.5rem', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.3s' }}
              onClick={() => router.push('/blog')}
              onMouseEnter={e => (e.currentTarget.style.textDecorationColor = '#0B4422')}
              onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
            >
              {t('blog.heading')}
            </h2>

            <LandingBlogCards />
            
            <p style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
              <button onClick={() => router.push('/blog')} className="glow-button">{t('blog.read_more_button')}</button>
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials-usersay" className="section" style={{ background: '#f5f5f5', padding: '3rem 2rem', scrollMarginTop: '80px' }}>
          <div className="container" style={{ marginTop: '-10px' }}>
            <h2
              className="section-title"
              style={{ marginTop: '-2.5rem', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.3s' }}
              onClick={() => router.push('/testimonials')}
              onMouseEnter={e => (e.currentTarget.style.textDecorationColor = '#0B4422')}
              onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
            >
              {t('testimonials.heading')}
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
              🔗 {t('testimonials.real_stories')}
            </p>

            <div className="testimonial">
              {t('testimonials.story1')}
            </div>
            <div className="testimonial">
              {t('testimonials.story2')}
            </div>

            <p style={{ textAlign: 'center', marginBottom: '-1rem' }}>
              {t('testimonials.one_story')} <Link href="/testimonials">{t('testimonials.share_story')}</Link>
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section id="clarity-anchor" className="cta-section" style={{ marginBottom: '5rem', textAlign: 'center', color: '#0B4422', padding: '3rem 1rem', scrollMarginTop: '80px' }}>
          <h2
            className="section-title"
            style={{ marginTop: 'calc(-2.5rem + 15px)', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.3s' }}
            onClick={() => router.push('/payment')}
            onMouseEnter={e => (e.currentTarget.style.textDecorationColor = '#0B4422')}
            onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
          >
            {t('cta.heading')}
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#374151' }}>
            {t('cta.every_day_someone_stuck')}
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#374151' }}>
            {t('cta.they_might_be')}
          </p>

          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h3 style={{ fontSize: '1.4rem', color: '#0B4422', marginBottom: '1rem', fontWeight: '600' }}>
                💚 {t('cta.if_you_can_give')}
              </h3>
              <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1rem' }}>
                {t('cta.a_quiet_shift')}
              </p>
              <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1.5rem' }}>
                {t('cta.your_donation_helps_us')}
              </p>
              <button 
                onClick={() => router.push('/payment')} 
                className="glow-button"
                style={{ 
                  fontSize: '1.1rem', 
                  padding: '0.8rem 1.5rem',
                  marginTop: '0.5rem',
                  background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
                  color: '#0B4422',
                  border: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  fontWeight: 600
                }}
              >
                🎁 {t('cta.sponsor_session')} →
              </button>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h3 style={{ fontSize: '1.4rem', color: '#0B4422', marginBottom: '1rem', fontWeight: '600' }}>
                🌱 {t('cta.if_you_need_help')}
              </h3>
              <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1rem' }}>
                {t('cta.cant_afford_session')}
              </p>
              <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1.5rem' }}>
                {t('cta.tell_us_challenge')}
              </p>
              <button 
                onClick={() => router.push('/supportdetails')} 
                className="glow-button"
                style={{ 
                  fontSize: '1.1rem', 
                  padding: '0.8rem 1.5rem',
                  marginTop: '0.5rem',
                  background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
                  color: '#0B4422',
                  border: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  fontWeight: 600
                }}
              >
                ✍️ {t('cta.share_challenge')} →
              </button>
            </div>
          </div>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '3rem', 
            fontSize: '1.1rem', 
            color: '#0B4422',
            fontStyle: 'italic',
            fontWeight: '500'
          }}>
            {t('cta.we_hold_space')}
          </p>
        </section>
      </div>

      {/* Footer - Full variant with centralized ad management */}
      <Footer 
        variant="full"
        userType="guest"
      />
    </>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
} 
