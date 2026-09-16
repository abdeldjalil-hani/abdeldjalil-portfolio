import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import UploadField from '../../components/admin/UploadField';

const FIELDS = [
  { section: 'Profile', items: [
    { name: 'name', label: 'Full name', type: 'text', required: true },
    { name: 'title_line_1', label: 'Title line 1', type: 'text' },
    { name: 'title_line_2', label: 'Title line 2', type: 'text' },
    { name: 'profile_image', label: 'Profile image', type: 'upload', subdir: 'profile' },
    { name: 'cv_url', label: 'CV URL (PDF)', type: 'url' },
  ]},
  { section: 'Hero', items: [
    { name: 'hero_heading', label: 'Hero heading', type: 'text' },
    { name: 'hero_subheading', label: 'Roles / subtitle', type: 'text' },
    { name: 'hero_introduction', label: 'Hero introduction', type: 'textarea', rows: 3 },
  ]},
  { section: 'Content', items: [
    { name: 'introduction', label: 'Short introduction', type: 'textarea', rows: 3 },
    { name: 'about_text', label: 'About text (paragraphs, one per line)', type: 'textarea', rows: 6 },
    { name: 'research_summary', label: 'Research summary', type: 'textarea', rows: 5 },
    { name: 'footer_text', label: 'Footer about text', type: 'textarea', rows: 2 },
  ]},
  { section: 'Contact', items: [
    { name: 'email', label: 'Email address', type: 'text' },
  ]},
  { section: 'Social', items: [
    { name: 'github', label: 'GitHub URL', type: 'url' },
    { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { name: 'instagram', label: 'Instagram URL', type: 'url' },
    { name: 'twitter', label: 'Twitter/X URL', type: 'url' },
    { name: 'website', label: 'Website URL', type: 'url' },
    { name: 'google_scholar', label: 'Google Scholar URL', type: 'url' },
    { name: 'orcid', label: 'ORCID URL', type: 'url' },
    { name: 'researchgate', label: 'ResearchGate URL', type: 'url' },
  ]},
];

export default function SettingsManager() {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    adminApi.settings().then((d) => {
      setSettings(d.settings);
      setForm(d.settings);
    }).catch((e) => toast.error(e.message));
  }, [toast]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminApi.updateSettings(form);
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!settings) return <div style={{ color: 'var(--text-faint)', padding: '30px 0' }}>Loading settings…</div>;

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {FIELDS.map((section) => (
        <div key={section.section} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>{section.section}</h3>
          {section.items.map((f) => (
            <div className="field" key={f.name}>
              <label>{f.label}{f.required && <span className="req"> *</span>}</label>
              {f.type === 'text' && (
                <input className="input" value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
              )}
              {f.type === 'url' && (
                <input className="input" type="url" value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} placeholder="https://…" />
              )}
              {f.type === 'textarea' && (
                <textarea className="textarea" rows={f.rows || 3} value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.type === 'upload' && (
                <UploadField
                  value={form[f.name] || ''}
                  onChange={(url) => set(f.name, url)}
                  subdir={f.subdir}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button className="btn btn-primary" disabled={busy}>
        {busy ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  );
}