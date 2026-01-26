import DOMPurify from 'dompurify';

// Configure a conservative allowlist and enforce safe URL schemes
const ALLOWED_TAGS = [
  'p', 'br', 'span', 'div', 'strong', 'em', 'b', 'i',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img'
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'target', 'rel'
];

// Add a hook to enforce https and same-origin style links; drop javascript: and other schemes
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  const name = data.attrName;
  const value = (data.attrValue || '').trim();

  if (name === 'href' || name === 'src') {
    // allow absolute https URLs or root-relative URLs; block everything else
    const isHttps = /^https:\/\//i.test(value);
    const isRootRelative = /^\/(?!\/)/.test(value);
    if (!isHttps && !isRootRelative) {
      data.keepAttr = false;
    }
  }

  // Ensure rel safety for links opening in a new tab
  if (name === 'target' && value === '_blank') {
    try { node.setAttribute('rel', 'noopener noreferrer'); } catch (e) { /* ignore */ }
  }
});

export default function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ['script', 'style', 'iframe'],
    USE_PROFILES: { html: true },
    // Prevent template-based injection patterns
    SAFE_FOR_TEMPLATES: true
  });
}
