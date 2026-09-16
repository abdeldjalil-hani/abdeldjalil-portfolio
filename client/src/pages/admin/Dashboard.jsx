import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { Link } from 'react-router-dom';

const LABELS = [
  { key: 'projects', label: 'Projects', to: '/admin/projects' },
  { key: 'publications', label: 'Publications', to: '/admin/publications' },
  { key: 'experiences', label: 'Experience', to: '/admin/experiences' },
  { key: 'education', label: 'Education', to: '/admin/education' },
  { key: 'events', label: 'Events', to: '/admin/events' },
  { key: 'teaching', label: 'Teaching', to: '/admin/teaching' },
  { key: 'certifications', label: 'Certifications', to: '/admin/certifications' },
  { key: 'skills', label: 'Skills', to: '/admin/skills' },
  { key: 'skillCategories', label: 'Skill Categories', to: '/admin/skills' },
  { key: 'socialLinks', label: 'Social Links', to: '/admin/settings' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 6 }}>Overview</h2>
      <p style={{ color: 'var(--text-faint)', marginBottom: 24 }}>A quick look at your portfolio content.</p>

      {!stats && (
        <div style={{ padding: '40px 0', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>Loading…</div>
      )}

      {stats && (
        <>
          <div className="stat-grid">
            {LABELS.map((l) => (
              <Link to={l.to} key={l.key} className="stat-card" style={{ display: 'block' }}>
                <div className="num">{stats.stats[l.key] ?? 0}</div>
                <div className="label">{l.label}</div>
              </Link>
            ))}
          </div>

          <div style={{ height: 40 }} />

          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Messages</h3>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMessages.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--text-faint)' }}>No messages yet.</td>
                  </tr>
                )}
                {stats.recentMessages.map((m) => (
                  <tr key={m.id}>
                    <td className="table-title">{m.name}</td>
                    <td>{m.email}</td>
                    <td className="table-sub">{m.subject}</td>
                    <td>
                      {m.isRead ? (
                        <span className="badge gray">Read</span>
                      ) : (
                        <span className="badge orange">Unread</span>
                      )}
                    </td>
                    <td className="table-sub">{new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ height: 40 }} />

          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Recent projects</h3>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProjects.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--text-faint)' }}>No projects yet. Add one to get started.</td>
                  </tr>
                )}
                {stats.recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td className="table-title">{p.title}</td>
                    <td>
                      {p.isPublished ? (
                        <span className="badge green">Published</span>
                      ) : (
                        <span className="badge gray">Draft</span>
                      )}
                    </td>
                    <td>
                      {p.isFeatured ? <span className="badge orange">Featured</span> : <span className="badge gray">—</span>}
                    </td>
                    <td className="table-sub">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}