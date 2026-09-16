import { useEffect } from 'react';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (content) el.setAttribute('content', content);
}

export default function Seo({ title, description, image, url, type = 'website' }) {
  useEffect(() => {
    const prev = document.title;
    document.title = title || 'Abdeldjalil Hani';
    setMeta('name', 'description', description || '');
    setMeta('property', 'og:title', title || '');
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url || window.location.href);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title || '');
    setMeta('name', 'twitter:description', description || '');
    return () => {
      document.title = prev;
    };
  }, [title, description, image, url, type]);

  return null;
}