// src/ContentContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePortfolio } from "./hooks/usePortfolio";
import { usePortfolioAdmin } from "./hooks/usePortfolioAdmin";
import { defaultContent } from "./contentConfig";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const { content: supabaseContent, loading, error, refetch } = usePortfolio();
  const { saveAllContent, saving } = usePortfolioAdmin();
  const [content, setContent] = useState(defaultContent);

  // Sincronizar con Supabase cuando carga
  useEffect(() => {
    if (supabaseContent) {
      setContent(prevContent => ({
        ...prevContent,
        ...supabaseContent,
        hero: {
          ...prevContent.hero,
          ...(supabaseContent.hero || {}),
        },
        about: {
          ...prevContent.about,
          ...(supabaseContent.about || {}),
        },
      }));
    }
  }, [supabaseContent]);

  // Función para guardar en Supabase
  const saveToSupabase = async (newContent) => {
    try {
      await saveAllContent(newContent);
      await refetch();
    } catch (err) {
      console.error("Error guardando en Supabase:", err);
      throw err;
    }
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      setContent, 
      loading, 
      error, 
      saveToSupabase,
      saving,
      refetch
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent debe usarse dentro de ContentProvider");
  return ctx;
}