// src/contentConfig.js
export const defaultContent = {
  hero: {
    title: "Hola, soy Bruno",
    subtitle: "Desarrollador Web",
    description:
      "Estudiante de Inteligencia Artificial y analista de sistemas. Me apasiona construir soluciones web con rendimiento, diseño y una gran experiencia de usuario.",
    hireLink: "#contacto",
    cvUrl: "/CV - Bruno Schutze.pdf",
    cvFileName: "Bruno-Schutze-CV.pdf",
  },
  about: {
    description:
      "Soy Bruno Schütze, estudiante de Inteligencia Artificial y analista de sistemas. Me enfoco en construir interfaces limpias, accesibles y performantes, integrando servicios modernos como React, Supabase y n8n, aplicando buenas prácticas de UI/UX.",
    education: "Licenciatura en Inteligencia Artificial (en curso)",
    skills: ["React", "TypeScript", "CSS", "Node.js", "Supabase", "n8n"],
  },
  projects: [
    {
      img: "project1.jpg",
      title: "Penguin Academy",
      tags: ["Next.js", "React", "TypeScript", "Tailwind"],
      url: "https://tu-proyecto-1.com",
      github: "https://github.com/usuario/proyecto-1",
    },
    {
      img: "project2.jpg",
      title: "THREEJS",
      tags: ["Three.js", "WebGL", "3D"],
      url: "https://tu-proyecto-2.com",
      github: "https://github.com/usuario/proyecto-2",
    },
    {
      img: "project3.jpg",
      title: "Entropy Evolve",
      tags: ["Python", "AI", "ML"],
      url: "https://tu-proyecto-3.com",
      github: "https://github.com/usuario/proyecto-3",
    },
  ],
  services: [
    { title: "Desarrollo Web", desc: "Aplicaciones modernas y responsivas." },
    {
      title: "Inteligencia Artificial",
      desc: "Modelos de IA y ML para tu negocio.",
    },
    {
      title: "Full Stack",
      desc: "De backend a frontend, escalable y optimizado.",
    },
  ],
};
