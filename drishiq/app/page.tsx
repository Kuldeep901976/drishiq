'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function HomePage() {
  const [animationStage, setAnimationStage] = useState(0);
  const router = useRouter();

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

  const handleExperienceClick = () => {
    router.push('/sessions');
  };

  return (
    <>
      {/* Header - Matching original design */}
      <Header />

      {/* Page Content - Add top padding for fixed header */}
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
        <div className="motivational-container">
          <p className={`typewriter line1 ${animationStage >= 1 ? 'show' : ''}`}>
            <strong>See Through the Challenge</strong>
          </p>
          <p className={`typewriter line2 ${animationStage >= 2 ? 'show' : ''}`}>
            <strong>Discover the Intelligence of Perception</strong>
          </p>
          <p className={`typewriter line3 ${animationStage >= 3 ? 'show' : ''}`}>
            <strong>Start Your DrishiQ Journey Today</strong>
          </p>

           <button onClick={() => router.push('/invitation')} className="glow-button">
          ✨ Experience DrishiQ
          </button>
        </div>

        {/* Hero Call to Action Section */}
        <section className="hero-section">
          <div className="container">
            <h2 className="section-title" style={{ color: '#0B4422', marginTop: '-2.5rem' }}>
              Welcome to DrishiQ
            </h2>
            <p style={{ color: '#FFD700', fontSize: '1.2rem' }}>
              Unlock your potential with guided self-inquiry and expert support.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', gap: '1rem' }}>
            <button onClick={() => router.push('/invitation')} className="glow-button1">
            ✨ Start Your Session
          </button>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title" style={{ marginTop: '-2.5rem', color: '#0B4422' }}>
              About DrishiQ
            </h2>
            <p>
              DrishiQ is your companion for self-discovery, clarity, and growth. Our platform blends science, technology, and human insight to help you see through challenges and make confident decisions.
            </p>
            <p style={{ color: '#0B4422' }}>
              Discover a new way to understand yourself and the world around you.
            </p>
          </div>
        </section>

        <section className="section">
            <h2 className="section-title" style={{marginTop: '-1rem'}}>🎯 Areas We Help</h2>
            <div className="areas-grid">
              <div className="area-card">“Breaking the loop of overthinking”</div>
              <div className="area-card">“Not sure what I want in life”</div>
              <div className="area-card">“Everyone expects something different from me”</div>
              <div className="area-card">“I can’t talk without feeling judged”</div>
              <div className="area-card">“Improving my tennis forehand”</div>
              <div className="area-card">“Preparing for a senior job interview”</div>
              <div className="area-card">“Good at science, but don’t know what’s next”</div>
              <div className="area-card">“Not sure if I should continue my marriage”</div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem' }}>
              Explore how DrishiQ can help you. 
              <span onClick={() => router.push('/invitation')} style={{ color: '#0B4422', fontWeight: '700', textDecoration: 'underline', marginLeft: '0.5rem', cursor: 'pointer' }}>
                Start Now
              </span>
            </p>
          </section>

        {/* Features Section */}
        <section id="features" style={{ background: '#F5F5F5', padding: '0.1rem 0' }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: '3rem' }}>
              Features
            </h2>

            <div className="features-grid features-cards">
              <div className="card">
                <Image 
                  src="/assets/other-Icons/Search.png" 
                  alt="Structured Self-Inquiry" 
                  width={400} 
                  height={200}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div className="card-content">
                  <h3>Structured Self-Inquiry</h3>
                  <p>Guided questions and exercises to help you reflect and gain clarity.</p>
                </div>
              </div>

              <div className="card">
                <Image 
                  src="/assets/other-Icons/Toggle.png" 
                  alt="Expectation Matrix" 
                  width={400} 
                  height={200}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div className="card-content">
                  <h3>Expectation Matrix</h3>
                  <p>Visualize and balance the expectations of yourself and others.</p>
                </div>
              </div>

              <div className="card">
                <Image 
                  src="/assets/other-Icons/Mic.png" 
                  alt="Voice & Multilingual Support" 
                  width={400} 
                  height={200}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div className="card-content">
                  <h3>Voice & Multilingual Support</h3>
                  <p>Interact with DrishiQ using your voice, in multiple languages.</p>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '3rem' }}>
              See DrishiQ in action. <span onClick={() => router.push('/invitation')} className="button" style={{ cursor: 'pointer' }}>✨Try Now</span>
            </p>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="section">
          <div className="container">
            <h2 className="section-title" style={{ marginTop: '-3rem', color: '#0B4422' }}>
            🤝 Support
            </h2>
            <p>We’re here to help you every step of the way. Our team and community are ready to support your journey.</p>
            <p>Get personalized guidance, resources, and encouragement.</p>
            <p>Join our movement and make a difference in your life and others’.</p>

            <ol style={{ fontSize: '1.1rem' }}>
              <li>- Sign up for a free account</li>
              <li>- Start your first session</li>
              <li>- Track your progress</li>
              <li>- Connect with our support team</li>
            </ol>
            
            <p style={{ textAlign: 'center', color: '#0B4422', marginTop: '0.1rem', marginBottom: '-2rem' }}>
              Disclaimer: DrishiQ is a self-help platform and not a substitute for professional medical advice. <strong>Always consult a qualified professional for serious concerns.</strong> Join the movement and support DrishiQ’s mission.
              <Link href="/priceplan-enhanced#support-drishiQ" className="button">✨ Support Us</Link>
            </p>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" style={{ background: '#f5f5f5', marginTop: '6px', paddingTop: '0.1rem' }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>
              Blog
            </h2>

            <div className="blog-grid">
              <div className="card">
                <Image 
                  src="/assets/other-Icons/wisdombadge.png" 
                  alt="Wisdom Badge" 
                  width={400} 
                  height={200}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div className="card-content">
                  <h3>How to Build Self-Awareness</h3>
                  <p>Explore practical tips and stories to deepen your self-understanding.</p>
                  <Link href="/blog">Read More</Link>
                </div>
              </div>

              <div className="card">
                <Image 
                  src="/assets/other-Icons/growthicon.png" 
                  alt="Growth Icon" 
                  width={400} 
                  height={200}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div className="card-content">
                  <h3>Personal Growth Journeys</h3>
                  <p>Real stories from people who transformed their lives with DrishiQ.</p>
                  <Link href="/blog">Read More</Link>
                </div>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '-1rem' }}>
            <button onClick={() => router.push('/invitation')} className="glow-button">
          ✨ See More Articles
          </button>
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" style={{ background: '#ffffff', marginTop: '15px', paddingTop: '0.1rem' }}>
          <div className="container" style={{ marginTop: '-10px' }}>
            <h2 className="section-title">💬 Testimonials</h2>
            <p style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
              Hear from our users. <Link href="/testimonials">Read All Testimonials</Link>
            </p>

            <div className="testimonial">
              “DrishiQ helped me break through my mental blocks and find clarity.”
            </div>
            <div className="testimonial">
              “The self-inquiry process was eye-opening and empowering.”
            </div>

            <p style={{ textAlign: 'center', marginBottom: '-1rem' }}>
              Want to inspire others? → <Link href="/testimonials">Share Your Story</Link>
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" style={{ marginBottom: '5rem', marginTop: '0rem' }}>
          <h2 className="section-title" style={{ marginTop: '1rem' }}>
            Ready to See Through the Challenge?
          </h2>
          <p>Join DrishiQ and start your journey of self-discovery and growth today.</p>
          <Link href="/invitation" passHref>
            <button className="button">Get Started</button>
          </Link>
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



"// Updated: $(date)" 
