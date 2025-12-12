// src/components/AdminDashboard.jsx
import React, { useState } from "react";
import { useContent } from "../ContentContext";

const IconPreview = ({ name }) => {
  const icons = {
    code: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>),
    ai: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>),
    monitor: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>),
    mobile: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>),
    server: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /></svg>),
    layout: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>),
    database: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>),
    cloud: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>),
    shield: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    zap: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>),
    layers: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>),
    globe: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></svg>),
    cpu: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg>),
    box: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>),
    terminal: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>),
    settings: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /></svg>),
  };
  return icons[name] || icons.layers;
};

export default function AdminDashboard({ onClose }) {
  const { content, setContent, saveToSupabase, saving } = useContent();
  const [draft, setDraft] = useState(content);
  const [activeTab, setActiveTab] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChangeHero = (f, v) => setDraft(p => ({ ...p, hero: { ...p.hero, [f]: v } }));
  const handleChangeAbout = (f, v) => setDraft(p => ({ ...p, about: { ...p.about, [f]: v } }));
  
  // ===== CV Upload =====
  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft(p => ({ 
          ...p, 
          hero: { 
            ...p.hero, 
            cvUrl: reader.result,
            cvFileName: file.name 
          } 
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo PDF');
    }
  };

  const removeCVFile = () => {
    setDraft(p => ({ 
      ...p, 
      hero: { 
        ...p.hero, 
        cvUrl: '',
        cvFileName: '' 
      } 
    }));
  };

  // ===== Educación Múltiple =====
  const getEducations = () => {
    if (!draft.about.education) return [];
    if (Array.isArray(draft.about.education)) return draft.about.education;
    return [draft.about.education];
  };

  const educations = getEducations();

  const handleEducationChange = (index, field, value) => {
    const newEducations = [...educations];
    newEducations[index] = { ...newEducations[index], [field]: value };
    setDraft(p => ({ ...p, about: { ...p.about, education: newEducations } }));
  };

  const addEducation = () => {
    const newEducations = [...educations, { institution: '', degree: '', status: '' }];
    setDraft(p => ({ ...p, about: { ...p.about, education: newEducations } }));
  };

  const removeEducation = (index) => {
    const newEducations = educations.filter((_, i) => i !== index);
    setDraft(p => ({ ...p, about: { ...p.about, education: newEducations } }));
  };
  
  // ===== Skills =====
  const normalizeSkills = (skills) => {
    if (!skills) return [];
    return skills.map(s => typeof s === 'string' ? { name: s, certificate: '' } : s);
  };

  const handleSkillNameChange = (i, v) => {
    const skills = normalizeSkills([...draft.about.skills]);
    skills[i] = { ...skills[i], name: v };
    setDraft(p => ({ ...p, about: { ...p.about, skills } }));
  };

  const handleSkillCertificateUpload = (i, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const skills = normalizeSkills([...draft.about.skills]);
        skills[i] = { ...skills[i], certificate: reader.result };
        setDraft(p => ({ ...p, about: { ...p.about, skills } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSkillCertificate = (i) => {
    const skills = normalizeSkills([...draft.about.skills]);
    skills[i] = { ...skills[i], certificate: '' };
    setDraft(p => ({ ...p, about: { ...p.about, skills } }));
  };

  const addSkill = () => setDraft(p => ({ 
    ...p, 
    about: { ...p.about, skills: [...(p.about.skills || []), { name: '', certificate: '' }] } 
  }));
  
  const removeSkill = (i) => setDraft(p => ({ 
    ...p, 
    about: { ...p.about, skills: p.about.skills.filter((_, x) => x !== i) } 
  }));

  // ===== Projects =====
  const handleProjectChange = (i, f, v) => { const pr = [...draft.projects]; pr[i] = { ...pr[i], [f]: v }; setDraft(p => ({ ...p, projects: pr })); };
  const handleProjectTagsChange = (i, v) => handleProjectChange(i, "tags", v.split(",").map(t => t.trim()).filter(Boolean));
  const handleProjectFeaturesChange = (i, v) => handleProjectChange(i, "features", v.split("\n").map(t => t.trim()).filter(Boolean));
  const handleProjectImageUpload = (i, e) => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onloadend = () => handleProjectChange(i, "img", r.result); r.readAsDataURL(f); } };
  const handleProjectGalleryUpload = (i, e) => { const fs = Array.from(e.target.files), imgs = []; fs.forEach(f => { const r = new FileReader(); r.onloadend = () => { imgs.push(r.result); if(imgs.length === fs.length) handleProjectChange(i, "images", [...(draft.projects[i].images||[]), ...imgs]); }; r.readAsDataURL(f); }); };
  const removeProjectImage = (pi, ii) => { const imgs = [...(draft.projects[pi].images||[])]; imgs.splice(ii, 1); handleProjectChange(pi, "images", imgs); };
  const addProject = () => setDraft(p => ({ ...p, projects: [...p.projects, { img: "", images: [], title: "", description: "", tags: [], features: [], url: "" }] }));
  const removeProject = (i) => setDraft(p => ({ ...p, projects: p.projects.filter((_, x) => x !== i) }));

  // ===== Services =====
  const handleServiceChange = (i, f, v) => { const s = [...draft.services]; s[i] = { ...s[i], [f]: v }; setDraft(p => ({ ...p, services: s })); };
  const addService = () => setDraft(p => ({ ...p, services: [...p.services, { title: "", desc: "", icon: "code" }] }));
  const removeService = (i) => setDraft(p => ({ ...p, services: p.services.filter((_, x) => x !== i) }));

  // ===== Save =====
  const handleSave = async () => {
    try {
      if (saveToSupabase) {
        await saveToSupabase(draft);
      } else {
        setContent(draft);
      }
      onClose();
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar los cambios');
    }
  };

  const Icons = {
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
    zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    save: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>,
    trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    certificate: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15l-2 5l2-1l2 1l-2-5z"/><circle cx="12" cy="9" r="6"/></svg>,
    menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  };

  const tabs = [{id:"hero",label:"Hero",icon:Icons.home},{id:"about",label:"Acerca",icon:Icons.user},{id:"projects",label:"Proyectos",icon:Icons.folder},{id:"services",label:"Servicios",icon:Icons.zap}];

  const skills = normalizeSkills(draft.about.skills || []);

  return (
    <div className="admin">
      {sidebarOpen && <div className="admin__overlay" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__logo">
          <span className="admin__logo-icon">{Icons.settings}</span>
          <div>
            <h2>Panel Admin</h2>
            <p className="admin__subtitle">Configuración del portfolio</p>
          </div>
          <button className="admin__sidebar-close" onClick={() => setSidebarOpen(false)}>
            {Icons.close}
          </button>
        </div>
        <nav className="admin__nav">
          {tabs.map(t => (
            <button 
              key={t.id} 
              className={`admin__nav-btn ${activeTab===t.id?"active":""}`} 
              onClick={() => {
                setActiveTab(t.id);
                setSidebarOpen(false);
              }}
            >
              <span className="admin__nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-footer">
          <button className="btn btn--ghost btn--full" onClick={() => {
            localStorage.removeItem("portfolio_is_admin");
            onClose();
          }}>
            <span className="btn__icon">{Icons.logout}</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
      
      <div className="admin__content">
        <header className="admin__header">
          <div className="admin__header-left">
            <button className="admin__menu-btn" onClick={() => setSidebarOpen(true)}>
              {Icons.menu}
            </button>
            <div>
              <h1>{tabs.find(t=>t.id===activeTab)?.label}</h1>
              <p className="admin__header-sub">Edita el contenido de tu portfolio</p>
            </div>
          </div>
          <div className="admin__header-actions">
            <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              <span className="btn__icon">{Icons.save}</span>
              <span className="admin__btn-text">{saving ? 'Guardando...' : 'Guardar cambios'}</span>
            </button>
          </div>
        </header>

        <div className="admin__body">
          {/* ===== HERO TAB ===== */}
          {activeTab==="hero" && (
            <div className="admin__section">
              <div className="admin__card">
                <h3 className="admin__card-title">Información Principal</h3>
                <div className="admin__grid">
                  <label className="field">
                    <span>Título</span>
                    <input value={draft.hero.title} onChange={e=>handleChangeHero("title",e.target.value)}/>
                  </label>
                  <label className="field">
                    <span>Subtítulo</span>
                    <input value={draft.hero.subtitle} onChange={e=>handleChangeHero("subtitle",e.target.value)}/>
                  </label>
                  <label className="field field--full">
                    <span>Descripción</span>
                    <textarea value={draft.hero.description} onChange={e=>handleChangeHero("description",e.target.value)} rows={3}/>
                  </label>
                </div>
              </div>

              <div className="admin__card">
                <h3 className="admin__card-title">Enlaces</h3>
                <div className="admin__grid">
                  <label className="field">
                    <span>Link Contratar</span>
                    <input value={draft.hero.hireLink} onChange={e=>handleChangeHero("hireLink",e.target.value)}/>
                  </label>
                </div>
              </div>

              {/* CV Upload Section */}
              <div className="admin__card">
                <h3 className="admin__card-title">Curriculum Vitae (CV)</h3>
                <div className="admin__cv-section">
                  {draft.hero.cvUrl ? (
                    <div className="admin__cv-preview">
                      <div className="admin__cv-info">
                        <span className="admin__cv-icon">{Icons.file}</span>
                        <div>
                          <p className="admin__cv-name">{draft.hero.cvFileName || 'CV.pdf'}</p>
                          <p className="admin__cv-status">✓ PDF cargado correctamente</p>
                        </div>
                      </div>
                      <div className="admin__cv-actions">
                        <a 
                          href={draft.hero.cvUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn--outline btn--sm"
                        >
                          Ver PDF
                        </a>
                        <button className="btn btn--danger btn--sm" onClick={removeCVFile}>
                          <span className="btn__icon">{Icons.trash}</span>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="admin__cv-upload">
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleCVUpload} 
                        hidden 
                      />
                      <span className="admin__cv-upload-icon">{Icons.upload}</span>
                      <span className="admin__cv-upload-text">
                        <strong>Subir CV en PDF</strong>
                        <small>Arrastra o haz click para seleccionar</small>
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* ===== ABOUT TAB (SIN INFORMACIÓN PERSONAL) ===== */}
          {activeTab==="about" && (
            <div className="admin__section">
              {/* Educación - Múltiple */}
              <div className="admin__card">
                <div className="admin__card-header">
                  <h3 className="admin__card-title">Educación</h3>
                  <button className="btn btn--outline btn--sm" onClick={addEducation}>
                    <span className="btn__icon">{Icons.plus}</span>
                    Agregar
                  </button>
                </div>
                
                {educations.length === 0 ? (
                  <p style={{ color: '#71717a', fontSize: '14px' }}>No hay educación agregada. Haz clic en "Agregar" para añadir.</p>
                ) : (
                  <div className="admin__education-list">
                    {educations.map((edu, index) => (
                      <div key={index} className="admin__education-item">
                        <div className="admin__education-header">
                          <span className="admin__education-number">#{index + 1}</span>
                          <button 
                            className="btn btn--icon btn--danger" 
                            onClick={() => removeEducation(index)}
                            title="Eliminar educación"
                          >
                            {Icons.trash}
                          </button>
                        </div>
                        <div className="admin__grid">
                          <label className="field">
                            <span>Institución</span>
                            <input 
                              value={edu.institution || ""} 
                              onChange={e => handleEducationChange(index, 'institution', e.target.value)}
                              placeholder="Ej: Universidad de Buenos Aires"
                            />
                          </label>
                          <label className="field">
                            <span>Carrera / Título</span>
                            <input 
                              value={edu.degree || ""} 
                              onChange={e => handleEducationChange(index, 'degree', e.target.value)}
                              placeholder="Ej: Licenciatura en Sistemas"
                            />
                          </label>
                          <label className="field">
                            <span>Estado</span>
                            <input 
                              value={edu.status || ""} 
                              onChange={e => handleEducationChange(index, 'status', e.target.value)}
                              placeholder="Ej: En curso, Graduado 2023"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Experiencia */}
              <div className="admin__card">
                <h3 className="admin__card-title">Experiencia</h3>
                <div className="admin__grid">
                  <label className="field">
                    <span>Puesto</span>
                    <input value={draft.about.experience?.position||""} onChange={e=>handleChangeAbout("experience",{...draft.about.experience,position:e.target.value})}/>
                  </label>
                  <label className="field">
                    <span>Empresa</span>
                    <input value={draft.about.experience?.company||""} onChange={e=>handleChangeAbout("experience",{...draft.about.experience,company:e.target.value})}/>
                  </label>
                  <label className="field field--full">
                    <span>Descripción</span>
                    <textarea value={draft.about.experience?.description||""} onChange={e=>handleChangeAbout("experience",{...draft.about.experience,description:e.target.value})} rows={2}/>
                  </label>
                  <label className="field">
                    <span>Período</span>
                    <input value={draft.about.experience?.period||""} onChange={e=>handleChangeAbout("experience",{...draft.about.experience,period:e.target.value})}/>
                  </label>
                </div>
              </div>
              
              {/* Habilidades */}
              <div className="admin__card">
                <h3 className="admin__card-title">Habilidades</h3>
                <div className="admin__skills-list">
                  {skills.map((skill, i) => (
                    <div key={i} className="admin__skill-item admin__skill-item--with-cert">
                      <div className="admin__skill-main">
                        <input 
                          value={skill.name} 
                          onChange={e => handleSkillNameChange(i, e.target.value)}
                          placeholder="Nombre de la habilidad"
                        />
                        <button className="btn btn--icon btn--danger" onClick={() => removeSkill(i)}>
                          {Icons.trash}
                        </button>
                      </div>
                      <div className="admin__skill-certificate">
                        {skill.certificate ? (
                          <div className="admin__cert-preview">
                            <img src={skill.certificate} alt="Certificado" />
                            <button 
                              className="admin__cert-remove" 
                              onClick={() => removeSkillCertificate(i)}
                            >
                              ✕
                            </button>
                            <span className="admin__cert-label">Certificado ✓</span>
                          </div>
                        ) : (
                          <label className="admin__cert-upload">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => handleSkillCertificateUpload(i, e)} 
                              hidden 
                            />
                            <span className="admin__cert-icon">{Icons.certificate}</span>
                            <span>Subir certificado</span>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="btn btn--outline btn--sm" onClick={addSkill}>
                    <span className="btn__icon">{Icons.plus}</span>Agregar habilidad
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* ===== PROJECTS TAB ===== */}
          {activeTab==="projects" && (
            <div className="admin__section">
              {draft.projects.map((p, i) => (
                <div key={i} className="admin__card admin__card--project">
                  <div className="admin__card-header">
                    <h3 className="admin__card-title">Proyecto #{i+1}</h3>
                    <button className="btn btn--danger btn--sm" onClick={() => removeProject(i)}>
                      <span className="btn__icon">{Icons.trash}</span>Eliminar
                    </button>
                  </div>
                  <div className="admin__project-grid">
                    <div className="admin__project-image-section">
                      <label className="admin__image-label">Imagen</label>
                      <div className="admin__image-upload">
                        {p.img ? (
                          <div className="admin__image-preview">
                            <img src={p.img} alt={p.title}/>
                            <button className="admin__image-remove" onClick={() => handleProjectChange(i, "img", "")}>✕</button>
                          </div>
                        ) : (
                          <label className="admin__image-dropzone">
                            <input type="file" accept="image/*" onChange={e => handleProjectImageUpload(i, e)} hidden/>
                            <span>Subir imagen</span>
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="admin__project-info">
                      <label className="field">
                        <span>Título</span>
                        <input value={p.title} onChange={e => handleProjectChange(i, "title", e.target.value)}/>
                      </label>
                      <label className="field">
                        <span>Descripción</span>
                        <textarea value={p.description || ""} onChange={e => handleProjectChange(i, "description", e.target.value)} rows={3}/>
                      </label>
                      <label className="field">
                        <span>Tags (separados por coma)</span>
                        <input value={(p.tags || []).join(", ")} onChange={e => handleProjectTagsChange(i, e.target.value)}/>
                      </label>
                    </div>
                  </div>
                  <label className="field">
                    <span>URL del Proyecto</span>
                    <input value={p.url} onChange={e => handleProjectChange(i, "url", e.target.value)}/>
                  </label>
                  <label className="field">
                    <span>Características (una por línea)</span>
                    <textarea value={(p.features || []).join("\n")} onChange={e => handleProjectFeaturesChange(i, e.target.value)} rows={3}/>
                  </label>
                  <div className="admin__gallery-section">
                    <label className="admin__image-label">Galería ({(p.images || []).length})</label>
                    <div className="admin__gallery">
                      {(p.images || []).map((img, ii) => (
                        <div key={ii} className="admin__gallery-item">
                          <img src={img} alt=""/>
                          <button className="admin__gallery-remove" onClick={() => removeProjectImage(i, ii)}>✕</button>
                        </div>
                      ))}
                      <label className="admin__gallery-add">
                        <input type="file" accept="image/*" multiple onChange={e => handleProjectGalleryUpload(i, e)} hidden/>
                        <span>+</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn--outline btn--full" onClick={addProject}>
                <span className="btn__icon">{Icons.plus}</span>Agregar proyecto
              </button>
            </div>
          )}
          
          {/* ===== SERVICES TAB ===== */}
          {activeTab==="services" && (
            <div className="admin__section">
              {draft.services.map((s, i) => (
                <div key={i} className="admin__card">
                  <div className="admin__card-header">
                    <h3 className="admin__card-title">Servicio #{i+1}</h3>
                    <button className="btn btn--danger btn--sm" onClick={() => removeService(i)}>
                      <span className="btn__icon">{Icons.trash}</span>Eliminar
                    </button>
                  </div>
                  <div className="admin__icon-selector">
                    <label className="admin__label">Icono</label>
                    <div className="admin__icon-grid">
                      {["code","ai","monitor","mobile","server","layout","database","cloud","shield","zap","layers","globe","cpu","box","terminal"].map(ic => (
                        <button 
                          key={ic} 
                          className={`admin__icon-btn ${s.icon === ic ? 'active' : ''}`} 
                          onClick={() => handleServiceChange(i, "icon", ic)}
                        >
                          <IconPreview name={ic}/>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="admin__grid">
                    <label className="field">
                      <span>Título</span>
                      <input value={s.title} onChange={e => handleServiceChange(i, "title", e.target.value)}/>
                    </label>
                    <label className="field">
                      <span>Descripción</span>
                      <textarea value={s.desc} onChange={e => handleServiceChange(i, "desc", e.target.value)} rows={2}/>
                    </label>
                  </div>
                </div>
              ))}
              <button className="btn btn--outline btn--full" onClick={addService}>
                <span className="btn__icon">{Icons.plus}</span>Agregar servicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}