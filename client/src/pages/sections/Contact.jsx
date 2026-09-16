import { useState } from 'react';
import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import Icon from '../../components/Icon';
import { safeUrl } from '../../utils/helpers';
import { publicApi } from '../../api/client';

const SOCIAL_PLATFORMS = ['github', 'linkedin', 'email', 'x', 'instagram', 'website'];

export default function Contact({ settings, socialLinks = [] }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const socials = (socialLinks || []).filter((s) => s.url);

  const contactInfo = [
    ...(settings.email ? [{ icon: 'mail', label: 'Email', value: settings.email, href: `mailto:${settings.email}` }] : []),
    ...(settings.linkedin ? [{ icon: 'linkedin', label: 'LinkedIn', value: settings.linkedin.replace(/^https?:\/\/(www\.)?/, ''), href: safeUrl(settings.linkedin) }] : []),
    ...(settings.github ? [{ icon: 'github', label: 'GitHub', value: settings.github.replace(/^https?:\/\/(www\.)?/, ''), href: safeUrl(settings.github) }] : []),
  ];

  socials.forEach((s) => {
    if (!contactInfo.some((c) => c.icon === s.platform) && SOCIAL_PLATFORMS.includes(s.platform)) {
      contactInfo.push({ icon: s.platform, label: s.platform, value: s.url.replace(/^https?:\/\/(www\.)?/, ''), href: safeUrl(s.url) });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setBusy(true);
    try {
      await publicApi.sendMessage(form);
      setStatus({ ok: true, text: 'Your message has been sent. Thank you for reaching out!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ ok: false, text: err.message || 'Could not send the message. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section section-dark" id="contact">
      <div className="container">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact"
          lead="Looking to collaborate on research, projects, or training? Send me a message."
          dark
        />
        <div className="contact-grid" style={{ gridTemplateColumns: '380px 1fr' }}>
          <Reveal>
            <div className="contact-info" style={{ color: 'var(--dark-text)' }}>
              <h3>Let's work together</h3>
              <p style={{ color: 'var(--dark-muted)' }}>
                I'm always open to discussing research collaborations, AI/ML projects,
                data science work, and teaching opportunities.
              </p>
              <div className="contact-links">
                {contactInfo.map((c) => (
                  <a key={c.label} href={c.href} className="contact-link" style={{ background: '#202226', borderColor: '#2e3136', color: 'var(--dark-text)' }} target="_blank" rel="noreferrer noopener">
                    <span className="cl-ico" style={{ background: '#2a2c31', color: 'var(--accent)' }}>
                      <Icon name={c.icon === 'mail' ? 'mail' : c.icon} size={18} />
                    </span>
                    <span>
                      <span className="cl-label" style={{ color: 'var(--dark-muted)' }}>{c.label}</span>
                      <br />
                      <span className="cl-value" style={{ color: 'var(--dark-text)' }}>{c.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form onSubmit={handleSubmit} className="admin-form" noValidate>
              {status && (
                <div className={`form-status ${status.ok ? 'ok' : 'err'}`}>{status.text}</div>
              )}
              <div className="form-row">
                <div className="field">
                  <label>Name <span className="req">*</span></label>
                  <input
                    className="input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="field">
                  <label>Email <span className="req">*</span></label>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="field">
                <label>Subject <span className="req">*</span></label>
                <input
                  className="input"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>
              <div className="field">
                <label>Message <span className="req">*</span></label>
                <textarea
                  className="textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your idea, project, or collaboration..."
                  required
                  minLength={10}
                  maxLength={20000}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}