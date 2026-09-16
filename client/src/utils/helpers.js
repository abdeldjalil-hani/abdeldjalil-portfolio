export function formatDate(dateStr, { fallback = '' } = {}) {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export function formatDateRange(start, end, isCurrent) {
  if (!start && !end) return isCurrent ? 'Present' : '';
  const startFmt = formatDate(start, { fallback: 'Unknown' });
  if (isCurrent) return `${startFmt} — Present`;
  const endFmt = formatDate(end, { fallback: '' });
  if (startFmt && endFmt) return `${startFmt} — ${endFmt}`;
  return startFmt || endFmt;
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function safeUrl(url) {
  if (!url) return '#';
  const s = String(url);
  return /^(https?:|mailto:)/i.test(s) ? s : `https://${s}`;
}

export function excerpt(text, max = 160) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s\S*$/, '')}…`;
}

export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 210);
}

export const CATEGORIES = ['AI / ML', 'Data Science', 'Quantum Computing', 'Web Development', 'Software', 'Research'];

export const EXPERIENCE_TYPES = ['research', 'teaching', 'internship', 'professional', 'volunteer', 'other'];

export const PUBLICATION_STATUSES = ['published', 'in_review', 'preprint', 'submitted'];

export const EVENT_TYPES = ['conference', 'workshop', 'training', 'community', 'seminar', 'hackathon', 'other'];

export const SOCIAL_PLATFORMS = ['github', 'linkedin', 'x', 'instagram', 'orcid', 'google-scholar', 'researchgate', 'website', 'email', 'youtube', 'other'];

export const UPLOAD_SUBDIRS = {
  Projects: 'projects',
  Publications: 'publications',
  Events: 'events',
  Teaching: 'teaching',
  Education: 'education',
  Certifications: 'certifications',
  'Profile image': 'profile',
};