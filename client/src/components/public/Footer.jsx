import { Link } from 'react-router-dom';
import Icon from '../Icon';

export default function Footer({ settings, socialLinks = [] }) {
  const year = new Date().getFullYear();
  const name = settings.name || 'Abdeldjalil Hani';

  const mainLinks = [
    { to: '/#about', label: 'About' },
    { to: '/#research', label: 'Research' },
    { to: '/#projects', label: 'Projects' },
    { to: '/#publications', label: 'Publications' },
  ];
  const moreLinks = [
    { to: '/#experience', label: 'Experience' },
    { to: '/#teaching', label: 'Teaching' },
    { to: '/#events', label: 'Events' },
    { to: '/#contact', label: 'Contact' },
  ];

  const social = (socialLinks || []).filter((s) => s.url);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>{name}</h4>
            <p style={{ fontSize: 14, maxWidth: 420 }}>
              {settings.footer_text || settings.introduction || ''}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {social.slice(0, 5).map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer noopener" aria-label={s.platform}>
                  <Icon name={s.icon || 'globe'} size={20} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>Site</h4>
            {mainLinks.map((l) => (
              <Link key={l.to} to={l.to} style={{ display: 'block' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>More</h4>
            {moreLinks.map((l) => (
              <Link key={l.to} to={l.to} style={{ display: 'block' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {name}. Built with React, Node.js &amp; MySQL.
          </span>
          <span>
            AI &amp; ML Engineer <span className="dot">·</span> Data Scientist <span className="dot">·</span> PhD Researcher
          </span>
        </div>
      </div>
    </footer>
  );
}