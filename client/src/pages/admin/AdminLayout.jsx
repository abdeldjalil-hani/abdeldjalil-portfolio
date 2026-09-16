import { useState } from 'react';
import { NavLink, Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastProvider } from '../../components/admin/Toast';
import Icon from '../../components/Icon';
import { classNames } from '../../utils/helpers';
import { useUnreadMessages } from '../../hooks/useUnreadMessages';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'chart', end: true },
  { to: '/admin/projects', label: 'Projects', icon: 'code' },
  { to: '/admin/publications', label: 'Publications', icon: 'code' },
  { to: '/admin/experiences', label: 'Experience', icon: 'chart' },
  { to: '/admin/education', label: 'Education', icon: 'chart' },
  { to: '/admin/skills', label: 'Skills', icon: 'brain' },
  { to: '/admin/events', label: 'Events', icon: 'globe' },
  { to: '/admin/teaching', label: 'Teaching', icon: 'flask' },
  { to: '/admin/certifications', label: 'Certifications', icon: 'code' },
];

const ICON_MAP = {
  dashboard: 'chart',
  projects: 'code',
  publications: 'code',
  experiences: 'chart',
  education: 'chart',
  skills: 'brain',
  events: 'globe',
  teaching: 'flask',
  certifications: 'code',
  settings: 'globe',
  messages: 'mail',
  seo: 'globe',
};

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const unread = useUnreadMessages(user);
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', color: 'var(--text-faint)' }}>
        Checking session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const pageTitle = (() => {
    const seg = location.pathname.replace('/admin', '').replace(/^\//, '');
    if (!seg) return 'Dashboard';
    if (seg === 'settings') return 'Site Settings';
    if (seg === 'messages') return 'Messages';
    if (seg === 'seo') return 'SEO';
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  })();

  return (
    <ToastProvider>
      <div className="admin-shell">
        <aside className={classNames('admin-side', sideOpen && 'open')}>
          <div className="admin-side-brand">
            <span className="mark">AH</span>
            <div>
              <div className="b-name">Portfolio</div>
              <div className="b-sub">Admin</div>
            </div>
          </div>
          <nav className="admin-nav">
            <div className="nav-group-label">Content</div>
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className="nav-ico"><Icon name={ICON_MAP[n.label.toLowerCase()] || n.icon} size={17} /></span>
                {n.label}
              </NavLink>
            ))}

            <div className="nav-group-label">System</div>
            <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-ico"><Icon name="globe" size={17} /></span>
              Settings
            </NavLink>
            <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-ico"><Icon name="mail" size={17} /></span>
              Messages
              {unread > 0 && (
                <span className="badge orange" style={{ marginLeft: 'auto' }}>{unread}</span>
              )}
            </NavLink>
            <NavLink to="/admin/seo" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="nav-ico"><Icon name="globe" size={17} /></span>
              SEO
            </NavLink>
          </nav>
          <div className="admin-side-foot">
            <span className="who">{user.name}</span>
            <button className="icon-btn" onClick={logout} title="Log out" style={{ color: 'var(--dark-muted)' }}>
              <Icon name="close" size={18} />
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-mobile-bar">
            <button className="btn btn-outline btn-sm" onClick={() => setSideOpen((v) => !v)}>
              Menu
            </button>
            <Link to="/" style={{ fontSize: 13, color: 'var(--text-faint)' }}>View site ↗</Link>
          </div>

          <div className="admin-top">
            <div className="t-title">{pageTitle}</div>
            <div className="admin-top-actions">
              <Link to="/" className="btn btn-outline btn-sm">View site</Link>
              <button className="btn btn-outline btn-sm" onClick={logout}>Log out</button>
            </div>
          </div>

          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}