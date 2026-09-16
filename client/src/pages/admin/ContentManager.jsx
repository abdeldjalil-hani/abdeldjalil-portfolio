import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Pagination from '../../components/admin/Pagination';
import UploadField from '../../components/admin/UploadField';
import MultiUploadField from '../../components/admin/MultiUploadField';
import Icon from '../../components/Icon';
import { slugify, classNames, formatDate } from '../../utils/helpers';

/* ------------------------------------------------------------------ */
/* Resource configuration                                              */
/* ------------------------------------------------------------------ */

const RESOURCE_CONFIG = {
  projects: {
    label: 'Projects',
    api: {
      list: (p) => adminApi.projects(p),
      create: (b) => adminApi.createProject(b),
      update: (id, b) => adminApi.updateProject(id, b),
      remove: (id) => adminApi.deleteProject(id),
    },
    columns: [
      { key: 'title', label: 'Title', render: (r) => <span className="table-title">{r.title}</span> },
      {
        key: 'status',
        label: 'Status',
        render: (r) => [
          r.isPublished ? <span key="1" className="badge green">Live</span> : <span key="2" className="badge gray">Draft</span>,
          r.isFeatured && <span key="3" className="badge orange" style={{ marginLeft: 6 }}>★</span>,
        ],
      },
      { key: 'categories', label: 'Categories', render: (r) => ((r.categories?.length ? r.categories : (r.category ? [r.category] : []))).join(', ') || '—' },
      { key: 'sortOrder', label: 'Order', render: (r) => <span style={{ fontFamily: 'var(--mono)' }}>{r.sortOrder}</span> },
      { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug (auto from title)', type: 'text' },
      { name: 'categories', label: 'Categories (choose multiple)', type: 'multi-select', options: ['AI / ML', 'Data Science', 'Quantum Computing', 'Web Development', 'Software', 'Research', 'Mobile / App Development', 'DevOps / Cloud', 'Cybersecurity', 'IoT / Embedded', 'Open Source', 'Desktop Apps', 'Data Analysis', 'Other'] },
      { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 6, monospace: false },
      { name: 'technologies', label: 'Technologies (comma separated)', type: 'tags' },
      { name: 'images', label: 'Images', type: 'multi-upload', subdir: 'projects' },
      { name: 'image', label: 'Featured image (optional)', type: 'upload', subdir: 'projects' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'demoUrl', label: 'Demo URL', type: 'url' },
      { name: 'publicationUrl', label: 'Publication URL', type: 'url' },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'isFeatured', label: 'Featured', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },

  publications: {
    label: 'Publications',
    api: {
      list: (p) => adminApi.publications(p),
      create: (b) => adminApi.createPublication(b),
      update: (id, b) => adminApi.updatePublication(id, b),
      remove: (id) => adminApi.deletePublication(id),
    },
    columns: [
      { key: 'title', label: 'Title', render: (r) => <span className="table-title">{r.title}</span> },
      { key: 'year', label: 'Year', render: (r) => r.year || '—' },
      { key: 'venue', label: 'Venue', render: (r) => (r.venue ? <span className="table-sub">{r.venue}</span> : '—') },
      {
        key: 'status',
        label: 'Status',
        render: (r) => <span className={classNames('badge', r.status === 'published' ? 'green' : 'orange')}>{r.status}</span>,
      },
      {
        key: 'featured',
        label: '',
        render: (r) => r.isFeatured && <span className="badge orange">★</span>,
      },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true },
      { name: 'authors', label: 'Authors', type: 'textarea', rows: 2, required: true },
      { name: 'venue', label: 'Venue', type: 'text' },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['published', 'in_review', 'preprint', 'submitted'] },
      { name: 'abstract', label: 'Abstract', type: 'textarea', rows: 6 },
      { name: 'doi', label: 'DOI', type: 'text' },
      { name: 'pdfUrl', label: 'PDF URL', type: 'url' },
      { name: 'externalUrl', label: 'External URL', type: 'url' },
      { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'isFeatured', label: 'Featured', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },

  experiences: {
    label: 'Experience',
    api: {
      list: (p) => adminApi.experiences(p),
      create: (b) => adminApi.createExperience(b),
      update: (id, b) => adminApi.updateExperience(id, b),
      remove: (id) => adminApi.deleteExperience(id),
    },
    columns: [
      { key: 'position', label: 'Position', render: (r) => <span className="table-title">{r.position}</span> },
      { key: 'organization', label: 'Organization', render: (r) => r.organization },
      { key: 'type', label: 'Type', render: (r) => <span className="badge gray">{r.type}</span> },
      { key: 'period', label: 'Period', render: (r) => `${formatDate(r.startDate, { fallback: '?' })} → ${r.isCurrent ? 'Present' : formatDate(r.endDate, { fallback: '?' })}` },
    ],
    fields: [
      { name: 'position', label: 'Position', type: 'text', required: true },
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'type', label: 'Type', type: 'select', options: ['research', 'teaching', 'internship', 'professional', 'volunteer', 'other'] },
      { name: 'startDate', label: 'Start (month / year)', type: 'date' },
      { name: 'endDate', label: 'End (month / year)', type: 'date' },
      { name: 'isCurrent', label: 'Current position', type: 'check' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
      { name: 'technologies', label: 'Technologies (comma separated)', type: 'tags' },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },

  education: {
    label: 'Education',
    api: {
      list: (p) => adminApi.education(p),
      create: (b) => adminApi.createEducation(b),
      update: (id, b) => adminApi.updateEducation(id, b),
      remove: (id) => adminApi.deleteEducation(id),
    },
    columns: [
      { key: 'degree', label: 'Degree', render: (r) => <span className="table-title">{r.degree}</span> },
      { key: 'institution', label: 'Institution', render: (r) => r.institution },
      { key: 'field', label: 'Field', render: (r) => r.field || '—' },
      { key: 'period', label: 'Period', render: (r) => `${formatDate(r.startDate, { fallback: '?' })} → ${r.isCurrent ? 'Present' : formatDate(r.endDate, { fallback: '?' })}` },
    ],
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true },
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'field', label: 'Field', type: 'text' },
      { name: 'startDate', label: 'Start (month / year)', type: 'date' },
      { name: 'endDate', label: 'End (month / year)', type: 'date' },
      { name: 'isCurrent', label: 'Current', type: 'check' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },

  events: {
    label: 'Events',
    api: {
      list: (p) => adminApi.events(p),
      create: (b) => adminApi.createEvent(b),
      update: (id, b) => adminApi.updateEvent(id, b),
      remove: (id) => adminApi.deleteEvent(id),
    },
    columns: [
      { key: 'title', label: 'Title', render: (r) => <span className="table-title">{r.title}</span> },
      { key: 'eventType', label: 'Type', render: (r) => r.eventType || '—' },
      { key: 'eventDate', label: 'Date', render: (r) => formatDate(r.eventDate, { fallback: '—' }) },
      { key: 'location', label: 'Location', render: (r) => r.location || '—' },
      { key: 'status', label: 'Status', render: (r) => [r.isPublished ? <span key="1" className="badge green">Live</span> : <span key="2" className="badge gray">Draft</span>, r.isFeatured && <span key="3" className="badge orange" style={{ marginLeft: 6 }}>★</span>] },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true },
      { name: 'eventType', label: 'Event type', type: 'select', options: ['conference', 'workshop', 'training', 'community', 'seminar', 'hackathon', 'other'] },
      { name: 'eventDate', label: 'Date (month / year)', type: 'date' },
      { name: 'endDate', label: 'End (month / year)', type: 'date' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'fullDescription', label: 'Full description', type: 'textarea', rows: 6 },
      { name: 'image', label: 'Image', type: 'upload', subdir: 'events' },
      { name: 'externalUrl', label: 'External URL', type: 'url' },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'isFeatured', label: 'Featured', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },

  teaching: {
    label: 'Teaching & Training',
    api: {
      list: (p) => adminApi.teaching(p),
      create: (b) => adminApi.createTeaching(b),
      update: (id, b) => adminApi.updateTeaching(id, b),
      remove: (id) => adminApi.deleteTeaching(id),
    },
    columns: [
      { key: 'title', label: 'Title', render: (r) => <span className="table-title">{r.title}</span> },
      { key: 'organization', label: 'Organization', render: (r) => r.organization },
      { key: 'date', label: 'Date', render: (r) => formatDate(r.date, { fallback: '—' }) },
      { key: 'audience', label: 'Audience', render: (r) => r.audience || '—' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true },
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      { name: 'date', label: 'Date (month / year)', type: 'date' },
      { name: 'audience', label: 'Audience', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
      { name: 'image', label: 'Image', type: 'upload', subdir: 'teaching' },
      { name: 'externalUrl', label: 'External URL', type: 'url' },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },

  certifications: {
    label: 'Certifications',
    api: {
      list: (p) => adminApi.certifications(p),
      create: (b) => adminApi.createCertification(b),
      update: (id, b) => adminApi.updateCertification(id, b),
      remove: (id) => adminApi.deleteCertification(id),
    },
    columns: [
      { key: 'title', label: 'Title', render: (r) => <span className="table-title">{r.title}</span> },
      { key: 'organization', label: 'Organization', render: (r) => r.organization },
      { key: 'date', label: 'Date', render: (r) => formatDate(r.date, { fallback: '—' }) },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'textarea', rows: 2, required: true },
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      { name: 'date', label: 'Date (month / year)', type: 'date' },
      { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
      { name: 'image', label: 'Image', type: 'upload', subdir: 'certifications' },
      { name: 'isPublished', label: 'Published', type: 'check' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Skills manager (categories + skills nested)                         */
/* ------------------------------------------------------------------ */

function SkillsManager() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null); // { kind: 'cat'|'skill', item }
  const [creating, setCreating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminApi
      .skills()
      .then((d) => setData(d.skillCategories))
      .catch((e) => toast.error(e.message));
  }, [toast]);

  useEffect(load, [load]);

  const save = async (body) => {
    setBusy(true);
    try {
      if (creating?.kind === 'cat') {
        await adminApi.createSkillCategory(body);
        toast.success('Category added.');
      } else if (creating?.kind === 'skill') {
        await adminApi.createSkill({ ...body, categoryId: creating.categoryId });
        toast.success('Skill added.');
      } else if (editing?.kind === 'cat') {
        await adminApi.updateSkillCategory(editing.item.id, body);
        toast.success('Category updated.');
      } else if (editing?.kind === 'skill') {
        await adminApi.updateSkill(editing.item.id, body);
        toast.success('Skill updated.');
      }
      setEditing(null);
      setCreating(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      if (deleting.kind === 'cat') {
        await adminApi.deleteSkillCategory(deleting.item.id);
      } else {
        await adminApi.deleteSkill(deleting.item.id);
      }
      toast.success('Deleted.');
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const skillForm = (kind, item, categoryId) => (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        save({
          name: fd.get('name'),
          icon: fd.get('icon'),
          level: fd.get('level') ? Number(fd.get('level')) : null,
          sortOrder: fd.get('sortOrder') ? Number(fd.get('sortOrder')) : 0,
          isPublished: fd.get('isPublished') === 'on',
          ...(kind === 'skill' ? { categoryId } : {}),
        });
      }}
    >
      <div className="field">
        <label>{kind === 'cat' ? 'Category name' : 'Skill name'}</label>
        <input className="input" name="name" defaultValue={item?.name || ''} required placeholder={kind === 'cat' ? 'e.g. Programming' : 'e.g. Python'} />
      </div>
      {kind === 'cat' ? (
        <>
          <div className="field"><label>Icon (optional, small text)</label><input className="input" name="icon" defaultValue={item?.icon || ''} placeholder="e.g. code, brain, globe" /></div>
        </>
      ) : (
        <div className="form-row">
          <div className="field">
            <label>Level (1–5, optional)</label>
            <input className="input" name="level" type="number" min="1" max="5" defaultValue={item?.level ?? ''} placeholder="—" />
          </div>
        </div>
      )}
      <div className="form-row">
        <div className="field"><label>Sort order</label><input className="input" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} /></div>
      </div>
      <div className="checks" style={{ margin: '6px 0 16px' }}>
        <label className="check-line"><input type="checkbox" name="isPublished" defaultChecked={item?.isPublished !== false} /> Published</label>
      </div>
      <button className="btn btn-primary" disabled={busy}>Save</button>
    </form>
  );

  return (
    <div>
      <div className="toolbar">
        <div style={{ fontSize: 15, color: 'var(--text-soft)' }}>Organize skills by category.</div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating({ kind: 'cat' })}>+ New category</button>
      </div>

      {!data && <div style={{ color: 'var(--text-faint)', padding: '30px 0' }}>Loading…</div>}

      {data?.length === 0 && (
        <div className="empty">
          <div className="e-ico">◈</div>
          No skill categories yet.
        </div>
      )}

      {data?.map((cat) => (
        <div key={cat.id} className="table-wrap" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
            <div>
              <strong>{cat.name}</strong>
              {cat.icon && <span className="table-sub"> · {cat.icon}</span>}
              <span className="table-sub"> · {cat.skills?.length || 0} skills</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setCreating({ kind: 'skill', categoryId: cat.id })}>+ Skill</button>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing({ kind: 'cat', item: cat })}>Edit</button>
              <button className="btn btn-outline btn-sm" onClick={() => setDeleting({ kind: 'cat', item: cat })}>Delete</button>
            </div>
          </div>
          {cat.skills?.length > 0 ? (
            <table className="admin-table">
              <tbody>
                {cat.skills.map((s) => (
                  <tr key={s.id}>
                    <td className="table-title">{s.name}</td>
                    <td className="table-sub">Level: {s.level ? `${s.level}/5` : '—'}</td>
                    <td>
                      {s.isPublished ? <span className="badge green">Live</span> : <span className="badge gray">Hidden</span>}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="icon-btn" title="Edit" onClick={() => setEditing({ kind: 'skill', item: s })}>✎</button>
                      <button className="icon-btn danger" title="Delete" onClick={() => setDeleting({ kind: 'skill', item: s })}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '16px', color: 'var(--text-faint)', fontSize: 13 }}>No skills in this category.</div>
          )}
        </div>
      ))}

      <Modal
        open={!!creating}
        onClose={() => setCreating(null)}
        title={creating?.kind === 'cat' ? 'New category' : 'New skill'}
      >
        {skillForm(creating?.kind, null, creating?.categoryId)}
      </Modal>
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.kind === 'cat' ? `Edit category: ${editing?.item?.name}` : `Edit skill: ${editing?.item?.name}`}
      >
        {skillForm(editing?.kind, editing?.item, editing?.item?.categoryId)}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        text={`Delete this ${deleting?.kind === 'cat' ? 'category (and all its skills must be removed first)' : 'skill'}? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
        busy={busy}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic CRUD manager for other resources                            */
/* ------------------------------------------------------------------ */

function GenericManager({ config }) {
  const toast = useToast();
  const [rows, setRows] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    (p = page, q = search) => {
      const params = new URLSearchParams();
      params.set('page', String(p));
      if (q) params.set('q', q);
      config.api
        .list(`?${params.toString()}`)
        .then((d) => {
          setRows(d.data);
          setMeta(d.meta);
          setPage(d.meta.page);
        })
        .catch((e) => toast.error(e.message));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, page, search, toast]
  );

  useEffect(() => {
    setRows(null);
    setMeta(null);
    setPage(1);
    setSearch('');
    setEditing(null);
    setCreating(false);
    setDeleting(null);
    load(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const debouncedSearch = (v) => {
    setSearch(v);
    // simple debounce
    clearTimeout(debouncedSearch._t);
    debouncedSearch._t = setTimeout(() => load(1, v), 350);
  };

  const formToPayload = (form) => {
    const fd = new FormData(form);
    const payload = {};
    for (const field of config.fields) {
      const val = fd.get(field.name);
      if (field.type === 'check') {
        payload[field.name] = fd.get(field.name) === 'on';
      } else if (field.type === 'number') {
        payload[field.name] = val === '' ? null : Number(val);
      } else if (field.type === 'tags') {
        payload[field.name] = val ? val.split(',').map((t) => t.trim()).filter(Boolean) : [];
      } else if (field.type === 'upload') {
        payload[field.name] = val || null;
      } else if (field.type === 'multi-upload') {
        payload[field.name] = (editing?.[field.name] || []);
      } else if (field.type === 'multi-select') {
        payload[field.name] = form.querySelectorAll(`input[name="${field.name}"]:checked`).length
          ? Array.from(form.querySelectorAll(`input[name="${field.name}"]:checked`)).map((el) => el.value)
          : (editing?.[field.name] || []);
      } else if (field.type === 'date') {
        const m = fd.get(field.name);
        const day = fd.get(`${field.name}_day`);
        payload[field.name] = m ? (day ? `${m}-${String(day).padStart(2, '0')}` : m) : null;
      } else {
        payload[field.name] = val || (field.required ? (val ?? '') : null);
      }
    }
    if (payload.slug === '' && payload.title) payload.slug = slugify(payload.title);
    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = formToPayload(e.currentTarget);
    setBusy(true);
    try {
      if (creating) {
        await config.api.create(payload);
        toast.success(`${config.label} created.`);
      } else {
        await config.api.update(editing.id, payload);
        toast.success(`${config.label} updated.`);
      }
      setCreating(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await config.api.remove(deleting.id);
      toast.success('Deleted.');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (row, key, next) => {
    try {
      await config.api.update(row.id, { [key]: next });
      toast.success('Updated.');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const form = (
    <form className="admin-form" onSubmit={handleSave}>
      <input type="hidden" name="id" value={editing?.id || ''} />
      {config.fields.map((f) => (
        <div className="field" key={f.name}>
          <label>{f.label}{f.required && <span className="req"> *</span>}</label>
          {f.type === 'textarea' && (
            <textarea
              className="textarea"
              name={f.name}
              rows={f.rows || 3}
              defaultValue={editing?.[f.name] ?? ''}
              required={f.required}
            />
          )}
          {f.type === 'text' && (
            <input className="input" name={f.name} defaultValue={editing?.[f.name] ?? ''} required={f.required} />
          )}
          {f.type === 'url' && (
            <input className="input" type="url" name={f.name} defaultValue={editing?.[f.name] ?? ''} placeholder="https://…" />
          )}
          {f.type === 'number' && (
            <input className="input" type="number" name={f.name} defaultValue={editing?.[f.name] ?? ''} />
          )}
          {f.type === 'date' && (
            <>
              <div className="date-group">
                <input className="input" type="month" name={f.name} defaultValue={editing?.[f.name]?.slice(0, 7) ?? ''} />
                <input className="input" type="number" name={`${f.name}_day`} min={1} max={31} placeholder="Day" defaultValue={editing?.[f.name]?.length === 10 ? editing[f.name].slice(8, 10) : ''} />
              </div>
              <div className="hint">Day is optional — leave empty for month / year only.</div>
            </>
          )}
          {f.type === 'tags' && (
            <>
              <input className="input" name={f.name} defaultValue={(editing?.[f.name] || []).join(', ')} placeholder="Comma separated" />
              <div className="hint">Enter values separated by commas.</div>
            </>
          )}
          {f.type === 'select' && (
            <select className="select" name={f.name} defaultValue={editing?.[f.name] || ''}>
              <option value="">—</option>
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
          {f.type === 'multi-select' && (
            <div className="checks" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
              {f.options.map((o) => (
                <label className="check-line" key={o}>
                  <input
                    type="checkbox"
                    name={f.name}
                    value={o}
                    defaultChecked={(editing?.[f.name] || []).includes(o)}
                  /> {o}
                </label>
              ))}
            </div>
          )}
          {f.type === 'upload' && (
            <>
              <input type="hidden" name={f.name} value={editing?.[f.name] || ''} />
              <UploadField
                value={editing?.[f.name] || ''}
                onChange={(url) => setEditing({ ...(editing || {}), [f.name]: url })}
                subdir={f.subdir}
              />
            </>
          )}
          {f.type === 'multi-upload' && (
            <MultiUploadField
              value={editing?.[f.name] || []}
              onChange={(urls) => setEditing({ ...(editing || {}), [f.name]: urls })}
              subdir={f.subdir}
            />
          )}
          {f.type === 'check' && (
            <label className="check-line">
              <input type="checkbox" name={f.name} defaultChecked={editing ? !!editing[f.name] : f.name === 'isPublished'} />
              Yes
            </label>
          )}
        </div>
      ))}
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" disabled={busy}>Save</button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="toolbar">
        <div className="search">
          <span className="ico">⌕</span>
          <input
            className="input"
            placeholder={`Search ${config.label.toLowerCase()}…`}
            value={search}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>+ Add {config.label.slice(-1) === 's' ? config.label : config.label}</button>
      </div>

      {!rows && <div style={{ color: 'var(--text-faint)', padding: '30px 0' }}>Loading…</div>}
      {rows && (
        <>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {config.columns.map((c) => <th key={c.key}>{c.label}</th>)}
                  <th style={{ width: 150 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={config.columns.length + 1} style={{ color: 'var(--text-faint)' }}>
                      No entries found.
                    </td>
                  </tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id}>
                    {config.columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key] ?? '—'}</td>)}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {config.fields.some((f) => f.name === 'isPublished') && (
                        <button
                          className="icon-btn"
                          title={r.isPublished ? 'Unpublish' : 'Publish'}
                          onClick={() => togglePublish(r, 'isPublished', !r.isPublished)}
                        >
                          {r.isPublished ? '✓' : '○'}
                        </button>
                      )}
                      <button className="icon-btn" title="Edit" onClick={() => { setEditing(r); }}>✎</button>
                      <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(r)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={meta?.page}
            pages={meta?.pages}
            total={meta?.total}
            onChange={(p) => load(p, search)}
          />
        </>
      )}

      <Modal
        open={creating || !!editing}
        title={creating ? `Add ${config.label}` : `Edit ${config.label}`}
        onClose={() => { setCreating(false); setEditing(null); }}
        size="lg"
      >
        {form}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        text={`Delete "${deleting?.title || deleting?.position || deleting?.degree || deleting?.name || 'this item'}"? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
        busy={busy}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export default function ContentManager() {
  const { resource } = useParams();

  if (resource === 'skills') {
    return (
      <div>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>Skills</h2>
        <p style={{ color: 'var(--text-faint)', marginBottom: 20 }}>Manage your skills content.</p>
        <SkillsManager />
      </div>
    );
  }

  const config = useMemo(() => RESOURCE_CONFIG[resource], [resource]);

  if (!config) {
    return (
      <div className="empty">
        <div className="e-ico">?</div>
        Unknown resource: <strong>{resource}</strong>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>{config.label}</h2>
      <p style={{ color: 'var(--text-faint)', marginBottom: 20 }}>Manage your {config.label.toLowerCase()} content.</p>
      <GenericManager config={config} />
    </div>
  );
}