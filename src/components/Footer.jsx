import React from "react";
import { useContent } from "../ContentContext";
import logoImg from "../assets/logo.png";

export default function Footer({ onLogoClick }) {
  const { content } = useContent();
  const { hero } = content;
  const currentYear = new Date().getFullYear();
  const name = hero?.title?.replace("Hola, soy ", "") || "Bruno";

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          {/* Logo clickeable para abrir login */}
          <button 
            className="footer__logo" 
            onClick={onLogoClick}
            title="Panel Admin"
          >
            <img src={logoImg} alt="Logo" />
          </button>
          <div className="footer__info">
            <span className="footer__name">{name}</span>
            <span className="footer__tagline">Desarrollador web e IA. Soluciones con código.</span>
          </div>
        </div>

        <div className="footer__social">
          <div className="icon-content">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-social="linkedin">
              <div className="filled" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <div className="tooltip">LinkedIn</div>
          </div>
          
          <div className="icon-content">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" data-social="github">
              <div className="filled" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <div className="tooltip">GitHub</div>
          </div>
          
          <div className="icon-content">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" data-social="instagram">
              <div className="filled" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <div className="tooltip">Instagram</div>
          </div>
          
          <div className="icon-content">
            <a href="mailto:contacto@ejemplo.com" aria-label="Email" data-social="email">
              <div className="filled" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
            <div className="tooltip">Email</div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {currentYear} {name}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}