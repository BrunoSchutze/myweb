// src/components/LoginModal.jsx
import React, { useState, useEffect } from "react";
import "../css/login-modal.css";

export default function LoginModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simular un pequeño delay para el efecto
    setTimeout(() => {
      if (password === "bruno3") {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => setStatus("idle"), 2500);
      }
    }, 600);
  };

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="login-modal-backdrop" onClick={onClose}>
      <div 
        className={`login-modal ${shake ? "login-modal--shake" : ""}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono animado */}
        <div className={`login-modal__icon login-modal__icon--${status}`}>
          {status === "idle" && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          {status === "loading" && (
            <div className="login-modal__spinner" />
          )}
          {status === "success" && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {status === "error" && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        {/* Título dinámico */}
        <h2 className="login-modal__title">
          {status === "idle" && "Acceso Admin"}
          {status === "loading" && "Verificando..."}
          {status === "success" && "¡Bienvenido!"}
          {status === "error" && "Acceso Denegado"}
        </h2>

        {/* Subtítulo dinámico */}
        <p className={`login-modal__subtitle login-modal__subtitle--${status}`}>
          {status === "idle" && "Ingresa tu contraseña para continuar"}
          {status === "loading" && "Espera un momento..."}
          {status === "success" && "Accediendo al panel..."}
          {status === "error" && "Contraseña incorrecta"}
        </p>

        {/* Formulario (solo visible en idle y error) */}
        {(status === "idle" || status === "error") && (
          <form onSubmit={handleSubmit} className="login-modal__form">
            <div className={`login-modal__input-group ${status === "error" ? "login-modal__input-group--error" : ""}`}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoFocus
                autoComplete="current-password"
              />
              <div className="login-modal__input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

            <div className="login-modal__buttons">
              <button type="button" className="login-modal__btn login-modal__btn--cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="login-modal__btn login-modal__btn--submit">
                <span>Entrar</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* Botón cerrar */}
        <button className="login-modal__close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Indicador de progreso */}
        {status === "loading" && <div className="login-modal__progress" />}
        {status === "success" && <div className="login-modal__progress login-modal__progress--success" />}
      </div>
    </div>
  );
}