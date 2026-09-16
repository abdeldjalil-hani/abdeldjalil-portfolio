const { apiError } = require('./apiError');

/** Removes leading/trailing whitespace and drops control characters. */
function cleanString(value, maxLength) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;
  let out = value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (maxLength && out.length > maxLength) {
    out = out.slice(0, maxLength);
  }
  return out;
}

function cleanOptionalString(value, maxLength) {
  const out = cleanString(value, maxLength);
  if (!out) return null;
  return out;
}

function isEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isUrl(value) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateEmail(value) {
  if (!isEmail(value)) throw apiError(400, `"${value}" is not a valid email address.`);
  return value.trim().toLowerCase().slice(0, 190);
}

function validateUrl(value, fieldName = 'URL') {
  if (!value) return null;
  if (!isUrl(value)) throw apiError(400, `"${fieldName}" is not a valid http(s) URL.`);
  return value.trim().slice(0, 500);
}

function intOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

function boolOr(value, fallback) {
  if (value === undefined || value === null) return fallback;
  return value === true || value === 'true' || value === 1 || value === '1';
}

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean).slice(0, 50);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 50);
  }
  return [];
}

function parseYear(value) {
  const n = intOrNull(value);
  if (n === null) return null;
  if (n < 1900 || n > 2100) throw apiError(400, 'Year must be between 1900 and 2100.');
  return n;
}

/** Accepts "YYYY-MM" (month/year only) or "YYYY-MM-DD" and stores it as-is. */
function cleanOptionalDate(value) {
  const out = cleanString(value, 10);
  if (!out) return null;
  const m = out.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return null;
  const pad = (n) => String(n).padStart(2, '0');
  if (!m[3]) return `${year}-${pad(month)}`;
  const day = Number(m[3]);
  if (day < 1 || day > 31) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

module.exports = {
  cleanString,
  cleanOptionalString,
  cleanOptionalDate,
  isEmail,
  isUrl,
  validateEmail,
  validateUrl,
  intOrNull,
  boolOr,
  parseTags,
  parseYear,
};