import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';

const SEO_FIELDS = [
  { section: 'Home / Meta', items: [
    { name: 'meta_title', label: 'Site title', type: 'text' },
    { name: 'meta_description', label: 'Meta description', type: 'textarea', rows: 3 },
    { name: 'meta_keywords', label: 'Meta keywords', type: 'text' },
    { name: 'author_name', label: 'Author name', type: 'text' },
    { name: 'og_image', label: 'OG image URL (recommended 1200×630)', type: 'url' },
  ]},
  { section: 'Robots & Sitemap', items: [
    { name: 'robots_allow', label: 'Robots allow crawl', type: 'check' },
  ]},
];

export default function SeoManager() {
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
      {SEO_FIELDS.map((section) => (
        <div key={section.section} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>{section.section}</h3>
          {section.items.map((f) => (
            <div className="field" key={f.name}>
              <label>{f.label}</label>
              {f.type === 'text' && (
                <input className="input" value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.type === 'textarea' && (
                <textarea className="textarea" rows={f.rows || 3} value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.type === 'check' && (
                <label className="check-line">
                  <input
                    type="checkbox"
                    checked={form[f.name] === true || form[f.name] === 'true' || form[f.name] === '1'}
                    onChange={(e) => set(f.name, e.target.checked ? 'true' : 'false')}
                  />
                  Yes
                </label>
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