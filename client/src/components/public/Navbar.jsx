import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { classNames } from '../../utils/helpers';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#about', label: 'About' },
  { to: '/#research', label: 'Research' },
  { to: '/#projects', label: 'Projects' },
  { to: '/#experience', label: 'Experience' },
  { to: '/#education', label: 'Education' },
  { to: '/#publications', label: 'Publications' },
  { to: '/#teaching', label: 'Teaching' },
  { to: '/#events', label: 'Events' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#contact', label: 'Contact' },
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const name = settings.name || 'Abdeldjalil Hani';
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleClick = () => setOpen(false);

  return (
    <header className={classNames('nav', scrolled && 'scrolled')}>
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" onClick={handleClick}>
          <span className="mark">{initials}</span>
          <span>{name}</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>

        <nav className={classNames('nav-links', open && 'open')} aria-label="Main navigation">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={handleClick}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}