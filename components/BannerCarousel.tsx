'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../lib/drishiq-i18n';

interface Banner {
  id: number;
  title: string;
  text: string;
  image_url: string;
  cta_label: string;
  cta_link: string;
  is_active: boolean;
}

export default function BannerCarousel() {
  const { t } = useLanguage();

  // Recompute banners when t changes (i.e., when language changes)
  const defaultBanners = useMemo(() => [
    {
      image: '/assets/banners/banner-0-1753217601452.jpg',
      title: t('banner.0.title'),
      text: t('banner.0.text'),
      cta: { label: t('banner.0.cta'), link: '/invitation' }
    },
    {
      image: '/assets/banners/banner-1-1753218298881.jpg',
      title: t('banner.1.title'),
      text: t('banner.1.text'),
      cta: { label: t('banner.1.cta'), link: '/supportdetails' }
    },
    {
      image: '/assets/banners/banner-2-1753218056625.jpg',
      title: t('banner.2.title'),
      text: t('banner.2.text'),
      cta: { label: t('banner.2.cta'), link: '/support-details' }
    },
    {
      image: '/assets/banners/banner-3-1753218624317.jpg',
      title: t('banner.3.title'),
      text: t('banner.3.text'),
      cta: { label: t('banner.3.cta'), link: '/stories' }
    },
    {
      image: '/assets/banners/banner-4-1753218891541.avif',
      title: t('banner.4.title'),
      text: t('banner.4.text'),
      cta: { label: t('banner.4.cta'), link: '/about' }
    },
    {
      image: '/assets/banners/banner-5-1753218996511.avif',
      title: t('banner.5.title'),
      text: t('banner.5.text'),
      cta: { label: t('banner.5.cta'), link: '/signup' }
    }
  ], [t]);

  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState(defaultBanners);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update banners when defaultBanners changes (i.e., when language changes)
  useEffect(() => {
    setBanners(defaultBanners);
  }, [defaultBanners]);

  // Load banner data from saved JSON file
  const loadBanners = async () => {
    try {
      console.log('Loading banners from JSON file...');
      const response = await fetch(`/assets/banners/banners-data.json?t=${Date.now()}`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const savedBanners = await response.json();
        console.log('Loaded banners:', savedBanners);
        // Convert saved banner format to component format
        const formattedBanners = savedBanners.map((banner: Banner) => ({
          image: banner.image_url,
          title: banner.title,
          text: banner.text,
          cta: { 
            label: banner.cta_label, 
            link: banner.cta_link 
          }
        }));
        console.log('Formatted banners:', formattedBanners);
        setBanners(formattedBanners);
      } else {
        console.log('No saved banners found, using defaults');
      }
    } catch (error) {
      console.log('Error loading banners, using defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners.length]);

  const swipe = (direction: 'left' | 'right') => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (direction === 'left') {
      setCurrent((prev) => (prev + 1) % banners.length);
    } else {
      setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }
    // Restart interval
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  if (loading) {
    return (
      <section className="section" style={{ 
        background: '#f5f5f5', 
        marginTop: '-2rem', 
        paddingTop: '2rem', 
        paddingBottom: '2rem',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: '#0B4422' }}>Loading banners...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ 
      background: '#f5f5f5', 
      marginTop: '-2rem', 
      paddingTop: '2rem', 
      paddingBottom: '2rem',
      minHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      backgroundImage: `url(${banners[current].image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      {/* Overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1
      }}></div>
      
      <div className="container" style={{ 
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        zIndex: 2
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <button 
            aria-label="Previous" 
            onClick={() => swipe('right')} 
            style={{ 
              background: 'rgba(11, 68, 34, 0.8)', 
              border: 'none', 
              fontSize: 24, 
              cursor: 'pointer', 
              padding: '1rem',
              borderRadius: '50%',
              color: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            ‹
          </button>
          
          <div style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '0 2rem',
            maxWidth: '800px',
            margin: '0 auto',
            borderRadius: '15px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, marginTop: '25px' }}>
              <h1 style={{ 
                fontSize: '2.2rem', 
                fontWeight: 600, 
                marginBottom: '1.2rem', 
                color: '#0a3a1e',
                lineHeight: '1.2'
              }}>
                {banners[current].title}
              </h1>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 300, 
                color: '#1a1a1a', 
                marginBottom: '1.5rem',
                lineHeight: '1.6',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                {banners[current].text}
              </p>
              <a 
                href={banners[current].cta.link} 
                style={{ 
                  background: '#0B4422', 
                  color: '#fff', 
                  padding: '0.8rem 2rem', 
                  borderRadius: 25, 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(11, 68, 34, 0.3)',
                  marginTop: '80px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0a3a1e';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#0B4422';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {banners[current].cta.label}
              </a>
            </div>
          </div>
          
          <button 
            aria-label="Next" 
            onClick={() => swipe('left')} 
            style={{ 
              background: 'rgba(11, 68, 34, 0.8)', 
              border: 'none', 
              fontSize: 24, 
              cursor: 'pointer', 
              padding: '1rem',
              borderRadius: '50%',
              color: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            ›
          </button>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem'
        }}>
          {banners.map((_, idx) => (
            <span 
              key={idx} 
              style={{ 
                display: 'inline-block', 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: idx === current ? '#0B4422' : '#ccc', 
                margin: '0 6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setCurrent(idx);
                intervalRef.current = setInterval(() => {
                  setCurrent((prev) => (prev + 1) % banners.length);
                }, 5000);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 