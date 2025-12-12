// src/App.jsx
import React, { useState, useEffect } from "react";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Services from "./components/Services";
import About from "./components/About";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const sections = [
    { id: "inicio", label: "Inicio" },
    { id: "acerca", label: "Acerca" },
    { id: "proyectos", label: "Proyectos" },
    { id: "servicios", label: "Servicios" },
  ];

  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem("portfolio_is_admin") === "true";
    setIsAdmin(flag);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setShowAdmin(true); // entramos directo al dashboard
  };

  // 👉 Si estoy en modo admin + dashboard visible,
  //    muestro SOLO el panel, sin navbar ni nada del sitio público.
  if (isAdmin && showAdmin) {
    return (
      <>
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </>
    );
  }

  // 👉 Vista pública normal
  return (
    <>
      <Splash />
      <Navbar sections={sections} />
      <main>
        <Hero id="inicio" />
        <About id="acerca" />
        <Projects id="proyectos" />
        <Services id="servicios" />
      </main>
      <Footer onLogoClick={() => setShowLogin(true)} />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
