// src/components/Hero.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useContent } from "../ContentContext";
import CodeCard from "./CodeCard";
import SocialTooltip from "./SocialTooltip";

// Componente de Confeti mejorado
function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#ff0', '#f0f', '#0ff', '#0f0', '#ff6b6b', '#4ecdc4', '#ffe66d', '#fff', '#ff9f43', '#a55eea', '#26de81', '#fd79a8'];
      const newParticles = [];
      
      for (let i = 0; i < 150; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          startY: Math.random() * -20 - 10,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          speedX: (Math.random() - 0.5) * 4,
          speedY: Math.random() * 3 + 2,
          rotationSpeed: (Math.random() - 0.5) * 15,
          delay: Math.random() * 0.5,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
      }
      
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 4000);
    }
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`confetti-particle confetti-particle--${p.shape}`}
          style={{
            left: `${p.x}%`,
            top: `${p.startY}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: p.shape === 'rect' ? `${p.size * 0.4}px` : `${p.size}px`,
            animationDelay: `${p.delay}s`,
            '--speedX': p.speedX,
            '--speedY': p.speedY,
            '--rotation': `${p.rotation}deg`,
            '--rotationSpeed': p.rotationSpeed,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ id = "inicio" }) {
  const { content } = useContent();
  const { hero } = content;
  
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const textToType = hero.subtitle || "Desarrollador Web";

  // Efecto de escritura letra por letra con loop
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId;
    
    const type = () => {
      if (!isDeleting) {
        if (currentIndex <= textToType.length) {
          setDisplayText(textToType.slice(0, currentIndex));
          currentIndex++;
          timeoutId = setTimeout(type, 100);
        } else {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            type();
          }, 3000);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayText(textToType.slice(0, currentIndex));
          timeoutId = setTimeout(type, 50);
        } else {
          isDeleting = false;
          timeoutId = setTimeout(type, 500);
        }
      }
    };

    type();
    return () => clearTimeout(timeoutId);
  }, [textToType]);

  // Efecto del cursor parpadeante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Handler para descargar CV con confeti
  const handleDownloadCV = useCallback((e) => {
    e.preventDefault();
    
    if (!hero.cvUrl) {
      alert('No hay CV configurado. Agrégalo desde el panel de administración.');
      return;
    }

    // Mostrar confeti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);

    // Si es un base64 (PDF subido), crear descarga
    if (hero.cvUrl.startsWith('data:application/pdf')) {
      const link = document.createElement('a');
      link.href = hero.cvUrl;
      link.download = hero.cvFileName || 'CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Si es una URL externa, abrir en nueva pestaña
      window.open(hero.cvUrl, '_blank');
    }
  }, [hero.cvUrl, hero.cvFileName]);

  return (
    <section id={id} className="hero">
      <Confetti active={showConfetti} />
      
      <div className="hero__container">
        {/* Contenido izquierdo */}
        <div className="hero__content">
          <h1 className="hero__title">{hero.title}</h1>
          
          {/* Badge con animación de escritura */}
          <div className="role-badge">
            <span className="typing-text">{displayText}</span>
            <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>■</span>
          </div>

          <p className="hero__description">{hero.description}</p>

          {/* Botones */}
          <div className="cta-buttons">
            <a 
              href={hero.hireLink || "#contacto"} 
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Contratar
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <button 
              className="btn-secondary"
              onClick={handleDownloadCV}
            >
              Descargar CV
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>

          <SocialTooltip />
        </div>

        {/* CodeCard derecho */}
        <div className="hero__code">
          <CodeCard />
        </div>
      </div>
    </section>
  );
}