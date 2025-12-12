// src/hooks/usePortfolio.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePortfolio() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      
      // Usar la función RPC para obtener todo el contenido
      const { data, error } = await supabase.rpc('get_portfolio_content');
      
      if (error) throw error;
      
      setContent(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching portfolio content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
}