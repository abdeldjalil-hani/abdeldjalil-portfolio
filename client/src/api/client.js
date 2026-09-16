const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body = options.body;
  if (options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    credentials: 'include',
    body,
    signal: options.signal,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const api = {
  get: (path, opts = {}) => request(path, { method: 'GET', ...opts }),
  post: (path, body, opts = {}) =>
    request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts = {}) =>
    request(path, { method: 'PUT', body, ...opts }),
  del: (path, opts = {}) => request(path, { method: 'DELETE', ...opts }),
};

// ---- Public site ----
export const publicApi = {
  bundle: (signal) => api.get('/api/bundle', { signal }),
  settings: () => api.get('/api/settings'),
  projects: () => api.get('/api/projects'),
  project: (slug) => api.get(`/api/projects?slug=${encodeURIComponent(slug)}`),
  publications: () => api.get('/api/publications'),
  experiences: () => api.get('/api/experiences'),
  education: () => api.get('/api/education'),
  skills: () => api.get('/api/skills'),
  events: () => api.get('/api/events'),
  event: (id) => api.get(`/api/events/${id}`),
  teaching: () => api.get('/api/teaching'),
  certifications: () => api.get('/api/certifications'),
  social: () => api.get('/api/social'),
  sendMessage: (payload) => api.post('/api/contact', payload),
};

// ---- Auth ----
export const authApi = {
  login: (payload) => api.post('/api/auth/login', payload),
  logout: () => api.post('/api/auth/logout'),
  me: (token) => api.get('/api/auth/me', { token }),
};

// ---- Admin ----
export const adminApi = {
  dashboard: (token) => api.get('/api/admin/dashboard', { token }),
  projects: (params = '') => api.get(`/api/admin/projects${params}`, { token: getToken() }),
  createProject: (body) => api.post('/api/admin/projects', body, { token: getToken() }),
  updateProject: (id, body) => api.put(`/api/admin/projects/${id}`, body, { token: getToken() }),
  deleteProject: (id) => api.del(`/api/admin/projects/${id}`, { token: getToken() }),

  publications: (params = '') => api.get(`/api/admin/publications${params}`, { token: getToken() }),
  createPublication: (body) => api.post('/api/admin/publications', body, { token: getToken() }),
  updatePublication: (id, body) => api.put(`/api/admin/publications/${id}`, body, { token: getToken() }),
  deletePublication: (id) => api.del(`/api/admin/publications/${id}`, { token: getToken() }),

  experiences: (params = '') => api.get(`/api/admin/experiences${params}`, { token: getToken() }),
  createExperience: (body) => api.post('/api/admin/experiences', body, { token: getToken() }),
  updateExperience: (id, body) => api.put(`/api/admin/experiences/${id}`, body, { token: getToken() }),
  deleteExperience: (id) => api.del(`/api/admin/experiences/${id}`, { token: getToken() }),

  education: (params = '') => api.get(`/api/admin/education${params}`, { token: getToken() }),
  createEducation: (body) => api.post('/api/admin/education', body, { token: getToken() }),
  updateEducation: (id, body) => api.put(`/api/admin/education/${id}`, body, { token: getToken() }),
  deleteEducation: (id) => api.del(`/api/admin/education/${id}`, { token: getToken() }),

  skills: () => api.get('/api/admin/skills', { token: getToken() }),
  createSkillCategory: (body) => api.post('/api/admin/skill-categories', body, { token: getToken() }),
  updateSkillCategory: (id, body) => api.put(`/api/admin/skill-categories/${id}`, body, { token: getToken() }),
  deleteSkillCategory: (id) => api.del(`/api/admin/skill-categories/${id}`, { token: getToken() }),
  createSkill: (body) => api.post('/api/admin/skills', body, { token: getToken() }),
  updateSkill: (id, body) => api.put(`/api/admin/skills/${id}`, body, { token: getToken() }),
  deleteSkill: (id) => api.del(`/api/admin/skills/${id}`, { token: getToken() }),

  events: (params = '') => api.get(`/api/admin/events${params}`, { token: getToken() }),
  createEvent: (body) => api.post('/api/admin/events', body, { token: getToken() }),
  updateEvent: (id, body) => api.put(`/api/admin/events/${id}`, body, { token: getToken() }),
  deleteEvent: (id) => api.del(`/api/admin/events/${id}`, { token: getToken() }),

  teaching: (params = '') => api.get(`/api/admin/teaching${params}`, { token: getToken() }),
  createTeaching: (body) => api.post('/api/admin/teaching', body, { token: getToken() }),
  updateTeaching: (id, body) => api.put(`/api/admin/teaching/${id}`, body, { token: getToken() }),
  deleteTeaching: (id) => api.del(`/api/admin/teaching/${id}`, { token: getToken() }),

  certifications: (params = '') => api.get(`/api/admin/certifications${params}`, { token: getToken() }),
  createCertification: (body) => api.post('/api/admin/certifications', body, { token: getToken() }),
  updateCertification: (id, body) => api.put(`/api/admin/certifications/${id}`, body, { token: getToken() }),
  deleteCertification: (id) => api.del(`/api/admin/certifications/${id}`, { token: getToken() }),

  messages: (params = '') => api.get(`/api/admin/messages${params}`, { token: getToken() }),
  msgRead: (id) => api.put(`/api/admin/messages/${id}/read`, {}, { token: getToken() }),
  msgUnread: (id) => api.put(`/api/admin/messages/${id}/unread`, {}, { token: getToken() }),
  deleteMessage: (id) => api.del(`/api/admin/messages/${id}`, { token: getToken() }),

  settings: () => api.get('/api/admin/settings', { token: getToken() }),
  updateSettings: (body) => api.put('/api/admin/settings', body, { token: getToken() }),
  socialLinks: () => api.get('/api/admin/social-links', { token: getToken() }),
  createSocialLink: (body) => api.post('/api/admin/social-links', body, { token: getToken() }),
  updateSocialLink: (id, body) => api.put(`/api/admin/social-links/${id}`, body, { token: getToken() }),
  deleteSocialLink: (id) => api.del(`/api/admin/social-links/${id}`, { token: getToken() }),

  upload: (subdir, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/api/admin/upload/${subdir}`, fd, { token: getToken() });
  },
  deleteFile: (path) => api.del('/api/admin/file', { body: { path }, token: getToken() }),
};

function getToken() {
  try {
    return localStorage.getItem('ah_admin_token') || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  try {
    localStorage.setItem('ah_admin_token', token || '');
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('ah_admin_token');
  } catch {
    /* ignore */
  }
}

export { API_BASE };
export default api;