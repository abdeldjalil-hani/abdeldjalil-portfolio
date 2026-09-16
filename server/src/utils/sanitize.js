/**
 * Small helper shared by JSON/HTML producers to strip common dangerous
 * script patterns from plain-text fields. The client never trusts stored
 * HTML, so this is a defence-in-depth layer.
 */
function sanitizePlainText(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=\s*["']?[^"'\s>]+/gi, '');
}

const htmlEscape = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[ch];
  });

module.exports = { sanitizePlainText, htmlEscape };