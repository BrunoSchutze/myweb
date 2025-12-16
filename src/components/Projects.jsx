// src/components/Projects.jsx
import React, { useState, useEffect, useRef } from "react";
import { useContent } from "../ContentContext";

// Modal de detalle del proyecto
function ProjectModal({ project, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  if (!project) return null;

  const images = project.images && project.images.length > 0 
    ? project.images 
    : [project.img];

  const goToPrev = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div className="project-modal-backdrop" onClick={onClose}>
        <div className="project-modal" onClick={(e) => e.stopPropagation()}>
          <button className="project-modal__close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="project-modal__gallery">
            <div className="project-modal__main-image">
              <img 
                src={images[currentImage]} 
                alt={project.title}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('no-image');
                }}
              />
            </div>
            
            {images.length > 1 && (
              <>
                <button className="project-modal__nav project-modal__nav--prev" onClick={goToPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="project-modal__nav project-modal__nav--next" onClick={goToNext}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                
                <div className="project-modal__thumbnails">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      className={`project-modal__thumb ${idx === currentImage ? 'active' : ''}`}
                      onClick={() => setCurrentImage(idx)}
                    >
                      <img 
                        src={img} 
                        alt={`${project.title} ${idx + 1}`}
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} 
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            <button className="project-modal__fullscreen" onClick={() => setIsFullscreen(true)} title="Ver en pantalla completa">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>

          <div className="project-modal__content">
            <h2 className="project-modal__title">{project.title}</h2>
            
            <ul className="tags">
              {project.tags.map((tag) => (
                <li key={tag} data-skill={tag}>{tag}</li>
              ))}
            </ul>

            <p className="project-modal__desc">
              {project.description || "Descripción del proyecto próximamente."}
            </p>

            {project.features && project.features.length > 0 && (
              <div className="project-modal__features">
                <h4>Características:</h4>
                <ul>
                  {project.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="project-modal__links">
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" className="btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Ver Proyecto
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="project-lightbox" onClick={() => setIsFullscreen(false)}>
          <button className="project-lightbox__close" onClick={() => setIsFullscreen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img 
            src={images[currentImage]} 
            alt={project.title} 
            loading="lazy"
            onClick={(e) => e.stopPropagation()} 
          />
          {images.length > 1 && (
            <>
              <button className="project-lightbox__nav project-lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); goToPrev(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="project-lightbox__nav project-lightbox__nav--next" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <div className="project-lightbox__counter">{currentImage + 1} / {images.length}</div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default function Projects({ id = "proyectos" }) {
  const { content } = useContent();
  const { projects } = content;
  const [selectedProject, setSelectedProject] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX - gridRef.current.offsetLeft;
    scrollLeftRef.current = gridRef.current.scrollLeft;
    gridRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - gridRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    gridRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (gridRef.current) gridRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (gridRef.current) gridRef.current.style.cursor = 'grab';
    }
  };

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].pageX - gridRef.current.offsetLeft;
    scrollLeftRef.current = gridRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - gridRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    gridRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        grid.scrollLeft += e.deltaY;
      }
    };
    grid.addEventListener('wheel', handleWheel, { passive: false });
    return () => grid.removeEventListener('wheel', handleWheel);
  }, []);

  const scrollToLeft = () => gridRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  const scrollToRight = () => gridRef.current?.scrollBy({ left: 400, behavior: 'smooth' });

  // Si no hay proyectos, no mostrar nada
  if (!projects || projects.length === 0) {
    return (
      <section id={id} className="section" ref={sectionRef}>
        <div className="container">
          <div className="section__header">
            <h2>Mis Proyectos</h2>
            <p>Algunos de los proyectos en los que he trabajado</p>
          </div>
          <p style={{ textAlign: 'center', color: '#71717a' }}>Cargando proyectos...</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="section" ref={sectionRef}>
      <div className="container">
        <div className="section__header">
          <h2>Mis Proyectos</h2>
          <p>Algunos de los proyectos en los que he trabajado</p>
        </div>

        <div className="projects__wrapper">
          <button className={`projects__nav projects__nav--prev ${isVisible ? 'animate-in' : ''}`} onClick={scrollToLeft}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div 
            className="projects__grid" 
            ref={gridRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => {}}
          >
            {projects.map((proj, i) => (
              <article 
                key={proj.id || i} 
                className={`project-card ${isVisible ? 'animate-in' : ''}`}
                onClick={() => !isDraggingRef.current && setSelectedProject(proj)}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="project-card__image">
                  {proj.img ? (
                    <img 
                      src={proj.img} 
                      alt={proj.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('no-image');
                      }}
                    />
                  ) : (
                    <div className="project-card__no-image">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="project-card__overlay"><span>Ver detalles</span></div>
                </div>

                <div className="project-card__content">
                  <h3 className="project-card__title">{proj.title}</h3>
                  {proj.description && <p className="project-card__desc">{proj.description}</p>}
                  <ul className="tags project-card__tags">
                    {proj.tags && proj.tags.slice(0, 4).map((tag) => (<li key={tag} data-skill={tag}>{tag}</li>))}
                  </ul>
                  <div className="project-card__footer">
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" className="project-card__link" onClick={(e) => e.stopPropagation()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Ver Proyecto
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button className={`projects__nav projects__nav--next ${isVisible ? 'animate-in' : ''}`} onClick={scrollToRight}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}