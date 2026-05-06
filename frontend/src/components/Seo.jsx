import { useEffect } from 'react';

const DEFAULTS = {
  title: 'Amidjor — Modern E-commerce',
  description: 'Discover products, build your cart, and checkout with a clean modern experience.',
  image: 'https://via.placeholder.com/1200x630.png?text=Amidjor+Shop',
  siteName: 'Amidjor',
};

const updateMetaTag = (key, value, useProperty = false) => {
  if (!value) return;
  const attr = useProperty ? 'property' : 'name';
  const selector = `${attr}="${key}"`;
  let element = document.head.querySelector(`meta[${selector}]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
};

export default function Seo({ title, description, image, url, type = 'website' }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${DEFAULTS.siteName}` : DEFAULTS.title;
    document.title = pageTitle;

    updateMetaTag('description', description || DEFAULTS.description);
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', description || DEFAULTS.description, true);
    updateMetaTag('og:url', url || window.location.href, true);
    updateMetaTag('og:image', image || DEFAULTS.image, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', DEFAULTS.siteName, true);
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', description || DEFAULTS.description);
    updateMetaTag('twitter:image', image || DEFAULTS.image);
  }, [title, description, image, url, type]);

  return null;
}
