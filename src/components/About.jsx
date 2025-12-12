// src/components/About.jsx
import React, { useState, useEffect, useRef } from "react";
import { useContent } from "../ContentContext";
import Memoji3D from "./Memoji3D";

export default function About({ id = "acerca" }) {
  const { content } = useContent();
  const { about } = content;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const sectionRef = useRef(null);

  // Normalizar skills (pueden ser strings o objetos)
  const normalizeSkill = (skill) => {
    if (typeof skill === 'string') {
      return { name: skill, certificate: '' };
    }
    return skill;
  };

  // Normalizar educaciones (puede ser objeto único o array)
  const getEducations = () => {
    if (!about.education) return [];
    if (Array.isArray(about.education)) return about.education;
    return [about.education];
  };

  const educations = getEducations();

  // Intersection Observer para detectar cuando la sección es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section id={id} className="section about-section" ref={sectionRef}>
      <div className="container">
        <div className="about__layout">
          {/* Avatar 3D - Lado izquierdo */}
          <div className={`about__avatar ${isVisible ? 'animate-in' : ''}`}>
            <div className={`about__memoji-wrapper ${isVisible ? 'memoji-animate' : ''}`}>
              <Memoji3D />
            </div>
          </div>

          {/* Contenido - Lado derecho */}
          <div className="about__content">
            {/* Título Acerca de Mí */}
            <div className={`about__header ${isVisible ? 'animate-in' : ''}`}>
              <h2 className="about__title">Acerca de Mí</h2>
            </div>

            {/* Educación - Múltiples entradas */}
            {educations.length > 0 && (
              <div className={`about__block ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.1s' }}>
                <h4 className="about__block-title">
                  <span className="about__block-indicator"></span>
                  Educación
                </h4>
                <div className="about__education-list">
                  {educations.map((edu, index) => (
                    <div key={index} className="about__block-content about__education-item">
                      <p className="about__block-main">{edu.institution || "Universidad"}</p>
                      <p className="about__block-sub">{edu.degree || "Carrera"}</p>
                      <p className="about__block-meta">{edu.status || "Estado"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experiencia */}
            {about.experience && (
              <div className={`about__block ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.2s' }}>
                <h4 className="about__block-title">
                  <span className="about__block-indicator"></span>
                  Experiencia
                </h4>
                <div className="about__block-content">
                  <p className="about__block-main">
                    <strong>{about.experience.position || "Puesto"}</strong>
                    {about.experience.company && ` - ${about.experience.company}`}
                  </p>
                  <p className="about__block-sub">{about.experience.description || "Descripción"}</p>
                  <p className="about__block-meta">{about.experience.period || "Período"}</p>
                </div>
              </div>
            )}

            {/* Habilidades Técnicas */}
            <div className={`about__block ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.3s' }}>
              <h4 className="about__block-title">
                <span className="about__block-indicator"></span>
                Habilidades Técnicas
              </h4>
              {/* Hint de certificados */}
              <p className="about__cert-hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15l-2 5l2-1l2 1l-2-5z"/>
                  <circle cx="12" cy="9" r="6"/>
                  <path d="M9 9l2 2l4-4"/>
                </svg>
                <span>Haz click en el icono para ver certificados</span>
              </p>
              <ul className="about__skills">
                {about.skills && about.skills.map((skill, i) => {
                  const normalizedSkill = normalizeSkill(skill);
                  const hasCertificate = normalizedSkill.certificate && normalizedSkill.certificate.length > 0;
                  
                  return (
                    <li 
                      key={i} 
                      className={`about__skill ${isVisible ? 'skill-animate' : ''} ${hasCertificate ? 'about__skill--has-cert' : ''}`}
                      style={{ animationDelay: `${0.4 + i * 0.05}s` }}
                    >
                      <span className="about__skill-name">{normalizedSkill.name}</span>
                      {hasCertificate && (
                        <button 
                          className="about__skill-cert-btn"
                          onClick={() => setSelectedCert({ name: normalizedSkill.name, image: normalizedSkill.certificate })}
                          title="Ver certificado"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15l-2 5l2-1l2 1l-2-5z"/>
                            <circle cx="12" cy="9" r="6"/>
                            <path d="M9 9l2 2l4-4"/>
                          </svg>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Certificado */}
      {selectedCert && (
        <div className="cert-modal-backdrop" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal__close" onClick={() => setSelectedCert(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="cert-modal__header">
              <div className="cert-modal__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15l-2 5l2-1l2 1l-2-5z"/>
                  <circle cx="12" cy="9" r="6"/>
                  <path d="M9 9l2 2l4-4"/>
                </svg>
              </div>
              <h3 className="cert-modal__title">Certificado</h3>
              <p className="cert-modal__skill">{selectedCert.name}</p>
            </div>
            <div className="cert-modal__image">
              <img src={selectedCert.image} alt={`Certificado de ${selectedCert.name}`} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}