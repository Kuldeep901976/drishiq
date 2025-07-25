'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreativeHomePage() {
  const [animationStage, setAnimationStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const router = useRouter();
  const handleAboutClick = () => {
    if (window.location.pathname === '/') {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const headerHeight = 80; // Approximate header height
        const elementPosition = aboutSection.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    } else {
      router.push('/#about');
    }
  };


  useEffect(() => {
    setIsVisible(true);
    const timers = [
      setTimeout(() => setAnimationStage(1), 500),
      setTimeout(() => setAnimationStage(2), 1200),
      setTimeout(() => setAnimationStage(3), 2000),
      setTimeout(() => setAnimationStage(4), 2800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleExperienceClick = () => {
    router.push('/sessions');
  };

  return (
    <div className="creative-page">
      <style jsx>{`
        .creative-page {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            #0B4422 0%, 
            #166534 15%, 
            #F5FAF6 35%, 
            #ffffff 50%, 
            #E8F5E8 65%, 
            #166534 85%, 
            #0B4422 100%
          );
          background-size: 400% 400%;
          animation: gradientFlow 20s ease infinite;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .shape {
          position: absolute;
          opacity: 0.1;
          animation: float 8s ease-in-out infinite;
        }

        .shape:nth-child(1) {
          width: 100px;
          height: 100px;
          background: #0B4422;
          border-radius: 50%;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          width: 80px;
          height: 80px;
          background: #166534;
          border-radius: 20px;
          top: 30%;
          right: 10%;
          animation-delay: 2s;
          transform: rotate(45deg);
        }

        .shape:nth-child(3) {
          width: 60px;
          height: 60px;
          background: #0B4422;
          top: 70%;
          left: 15%;
          animation-delay: 4s;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .shape:nth-child(4) {
          width: 120px;
          height: 120px;
          background: #166534;
          border-radius: 50%;
          top: 80%;
          right: 20%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-30px) rotate(180deg); 
            opacity: 0.2;
          }
        }

        .main-container {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .hero-section {
          text-align: center;
          padding: 4rem 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          margin-bottom: 4rem;
          box-shadow: 
            0 25px 50px rgba(11, 68, 34, 0.1),
            0 0 0 1px rgba(11, 68, 34, 0.05);
          transform: ${isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'};
          opacity: ${isVisible ? 1 : 0};
          transition: all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .brand-title {
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0B4422 0%, #166534 50%, #22c55e 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          letter-spacing: -2px;
          position: relative;
        }

        .brand-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #0B4422, #22c55e);
          border-radius: 2px;
          animation: expandLine 1s ease 0.5s forwards;
          transform-origin: center;
          scale: 0;
        }

        @keyframes expandLine {
          to { scale: 1; }
        }

        .brand-subtitle {
          font-size: 1.6rem;
          color: #0B4422;
          font-weight: 600;
          margin-bottom: 3rem;
          letter-spacing: 1px;
        }

        .motivation-box {
          background: linear-gradient(135deg, rgba(11, 68, 34, 0.05) 0%, rgba(22, 101, 52, 0.08) 100%);
          border: 2px solid rgba(11, 68, 34, 0.1);
          border-radius: 25px;
          padding: 3rem 2rem;
          margin: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        .motivation-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(11, 68, 34, 0.1), transparent);
          animation: shimmer 3s ease infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .typewriter-line {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 1.2rem;
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .typewriter-line.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .line-1 { 
          color: #000080; 
          transition-delay: 0.2s;
        }
        .line-2 { 
          color: #0B4422; 
          transition-delay: 0.4s;
        }
        .line-3 { 
          color: #166534; 
          font-size: 1.6rem;
          font-weight: 700;
          transition-delay: 0.6s;
        }

        .cta-button-hero {
          display: inline-block;
          margin-top: 2rem;
          padding: 1.2rem 3rem;
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0B4422 0%, #166534 50%, #22c55e 100%);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 
            0 10px 30px rgba(11, 68, 34, 0.3),
            0 0 0 0 rgba(11, 68, 34, 0.4);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform: translateY(20px);
          opacity: 0;
          animation: buttonReveal 1s ease 3s forwards;
          position: relative;
          overflow: hidden;
        }

        .cta-button-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .cta-button-hero:hover::before {
          left: 100%;
        }

        .cta-button-hero:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 
            0 20px 40px rgba(11, 68, 34, 0.4),
            0 0 0 8px rgba(11, 68, 34, 0.1);
        }

        @keyframes buttonReveal {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .content-sections {
          display: grid;
          gap: 4rem;
        }

        .section {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 
            0 20px 40px rgba(11, 68, 34, 0.08),
            0 0 0 1px rgba(11, 68, 34, 0.05);
          position: relative;
          overflow: hidden;
        }

        .section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0B4422, #166534, #22c55e, #166534, #0B4422);
          background-size: 200% 100%;
          animation: gradientSlide 4s ease infinite;
        }

        @keyframes gradientSlide {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .feature-card {
          background: white;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(11, 68, 34, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
          cursor: pointer;
          position: relative;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0B4422, #166534, #22c55e);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
          border-radius: 25px;
        }

        .feature-card:hover {
          transform: translateY(-15px) scale(1.03);
          box-shadow: 0 25px 50px rgba(11, 68, 34, 0.2);
        }

        .feature-card:hover::before {
          opacity: 0.05;
        }

        .feature-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .feature-card:hover .feature-image {
          transform: scale(1.1);
        }

        .feature-content {
          padding: 2rem;
          position: relative;
          z-index: 2;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0B4422;
          margin-bottom: 1rem;
        }

        .feature-text {
          color: #666;
          line-height: 1.6;
          font-size: 1.1rem;
        }

        .testimonial-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: none;
          border-radius: 25px;
          padding: 2.5rem;
          margin: 1.5rem 0;
          position: relative;
          box-shadow: 0 10px 30px rgba(11, 68, 34, 0.1);
          font-size: 1.2rem;
          font-style: italic;
          transition: transform 0.3s ease;
        }

        .testimonial-card::before {
          content: '"';
          font-size: 5rem;
          color: #0B4422;
          position: absolute;
          top: -10px;
          left: 25px;
          font-family: serif;
          opacity: 0.3;
        }

        .testimonial-card:hover {
          transform: scale(1.02);
        }

        .final-cta {
          background: linear-gradient(135deg, #0B4422 0%, #166534 50%, #22c55e 100%);
          color: white;
          text-align: center;
          padding: 4rem 2rem;
          border-radius: 25px;
          position: relative;
          overflow: hidden;
          margin-top: 4rem;
        }

        .final-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 25s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .final-cta-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .final-cta-text {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
          opacity: 0.9;
        }

        .final-cta-button {
          background: white;
          color: #0B4422;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.2rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          text-decoration: none;
          display: inline-block;
        }

        .final-cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          background: #f0fdf4;
        }

        @media (max-width: 768px) {
          .brand-title { font-size: 2.8rem; }
          .brand-subtitle { font-size: 1.2rem; }
          .typewriter-line { font-size: 1.1rem; }
          .section-title { font-size: 2rem; }
          .main-container { padding: 1rem; }
          .section { padding: 2rem; }
          .features-grid { grid-template-columns: 1fr; }
          .areas-grid { grid-template-columns: 1fr; }
        }
     `}</style>

      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="main-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="brand-title">DrishiQ</h1>
          <p className="brand-subtitle">Intelligence of Perception</p>
          
          <div className="motivation-box">
            <div className={`typewriter-line line-1 ${animationStage >= 1 ? 'visible' : ''}`}>
              Feeling stuck in life decisions? You're not alone.
            </div>
            <div className={`typewriter-line line-2 ${animationStage >= 2 ? 'visible' : ''}`}>
              DrishiQ helps you find clarity through intelligent self-reflection.
            </div>
            <div className={`typewriter-line line-3 ${animationStage >= 3 ? 'visible' : ''}`}>
              See Through the Challenge
            </div>
            
            {animationStage >= 4 && (
              <button className="cta-button-hero" onClick={handleExperienceClick}>
                ✨ Start Your Journey to Clarity
              </button>
            )}
          </div>
        </section>

        <div className="content-sections">
          {/* Areas We Help */}
          <section className="section">
            <h2 className="section-title">🎯 Areas We Help</h2>
            <div className="areas-grid">
              <div className="area-card">"I'm stuck in a loop of overthinking."</div>
              <div className="area-card">"I don't know what I want anymore."</div>
              <div className="area-card">"Everyone expects something different from me."</div>
              <div className="area-card">"I feel like I can't talk to anyone without being judged."</div>
              <div className="area-card">"I want to improve my tennis forehand."</div>
              <div className="area-card">"I need to interview for senior position what should I ask."</div>
              <div className="area-card">"I am good at Science but not sure what to do next."</div>
              <div className="area-card">"I am not sure if I continue with my marriage or not."</div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem' }}>
              Want to explore how DrishiQ can help in your situation? 
              <Link href="/sessions" style={{ color: '#0B4422', fontWeight: '700', textDecoration: 'underline', marginLeft: '0.5rem' }}>
                Click here ✨
              </Link>
            </p>
          </section>

          {/* Features Section */}
          <section className="section">
            <h2 className="section-title">✨ What Makes DrishiQ Different</h2>

            <div className="features-grid">
              <div className="feature-card">
                <Image 
                  src="/assets/other-Icons/Search.png" 
                  alt="Structured Self-Inquiry" 
                  width={400} 
                  height={220}
                  className="feature-image"
                />
                <div className="feature-content">
                  <h3 className="feature-title">🔍 Structured Self-Inquiry</h3>
                  <p className="feature-text">We guide you with intelligent, reflective questions—not advice.</p>
                </div>
              </div>

              <div className="feature-card">
                <Image 
                  src="/assets/other-Icons/Toggle.png" 
                  alt="Expectation Matrix" 
                  width={400} 
                  height={220}
                  className="feature-image"
                />
                <div className="feature-content">
                  <h3 className="feature-title">📊 Expectation Matrix</h3>
                  <p className="feature-text">Visualize who expects what from you—and why it matters.</p>
                </div>
              </div>

              <div className="feature-card">
                <Image 
                  src="/assets/other-Icons/Mic.png" 
                  alt="Voice + Multilingual" 
                  width={400} 
                  height={220}
                  className="feature-image"
                />
                <div className="feature-content">
                  <h3 className="feature-title">🎤 Voice + Multilingual</h3>
                  <p className="feature-text">Speak your truth in your language. DrishiQ understands.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="section">
            <h2 className="section-title">🤝 Why Do We Need Support?</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem', textAlign: 'center' }}>
              We live in a world of increasing complexity. Each day, individuals silently battle emotional and mental weight.
              These dilemmas may appear personal, but their consequences are universal—burnout, fractured relationships, depression, disengagement.
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: '600', color: '#0B4422', textAlign: 'center' }}>
              The truth? Most of these issues stem not from lack of solutions but from a lack of clarity.
            </p>
          </section>

          {/* Testimonials */}
          <section className="section">
            <h2 className="section-title">💬 What Users Say</h2>
            
            <div className="testimonial-card">
              I felt like I was talking to someone who really listened. I got clarity, not advice. 🌟
            </div>
            <div className="testimonial-card">
              I walked in confused, walked out with a plan. This was different. ✨
            </div>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>
              Your journey with DrishiQ can inspire others. 
              <Link href="/testimonials" style={{ color: '#0B4422', fontWeight: '700', textDecoration: 'underline' }}>
                Want to share it? 💫
              </Link>
            </p>
          </section>
        </div>

        {/* Final CTA */}
        <section className="final-cta">
          <h2 className="final-cta-title">🌟 Ready to Clear the Mental Fog?</h2>
          <p className="final-cta-text">
            Start a session with DrishiQ and experience clarity through intelligent reflection.
          </p>
          <Link href="/sessions" className="final-cta-button">
            🎯 Start Your Clarity Journey
          </Link>
        </section>
      </div>
    </div>
  );
} 