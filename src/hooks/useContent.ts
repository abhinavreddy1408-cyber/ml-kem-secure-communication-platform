// src/hooks/useContent.ts
import { useState, useEffect } from 'react';

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  problem: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
  };
}

export function useContent() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch content', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading };
}
