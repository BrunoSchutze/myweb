import React, { useState, useEffect } from "react";
import "../css/navbar.css";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("inicio");

  const sections = [
    { id: "inicio", label: "Inicio" },
    { id: "acerca", label: "Acerca" },
    { id: "proyectos", label: "Proyectos" },
    { id: "servicios", label: "Servicios" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`navbar__link ${activeSection === section.id ? "active" : ""}`}
            onClick={(e) => handleClick(e, section.id)}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}