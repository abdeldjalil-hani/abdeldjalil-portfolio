import { Link } from 'react-router-dom';
import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import { formatDate, safeUrl } from '../../utils/helpers';
import { classNames } from '../../utils/helpers';

function monthDay(dateStr) {
  if (!dateStr) return { d: '', m: '' };
  const explicitDay = /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? Number(dateStr.slice(8, 10)) : '';
  const m = new Date(`${dateStr.slice(0, 7)}-01T00:00:00`);
  if (Number.isNaN(m.getTime())) return { d: '', m: '' };
  return { d: explicitDay, m: m.toLocaleString('en-US', { month: 'short' }) };
}

export default function Events({ events = [] }) {
  const list = events.filter((e) => e.isPublished !== false);

  return (
    <section className="section" id="events">
      <div className="container">
        <SectionHeading
          eyebrow="Community"
          title="Events & Workshops"
          lead="Conferences, workshops, training sessions, and community events."
        />
        {list.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Events will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="event-grid">
            {list.map((e) => {
              const { d, m } = monthDay(e.eventDate);
              return (
                <Reveal key={e.id}>
                  <div className="event-card">
                    <div className={`event-date${!d ? ' month-only' : ''}`}>
                      {d && <span className="d">{d}</span>}
                      <span className="m">{m}</span>
                    </div>
                    <div className="event-body">
                      {e.eventType && <span className="event-type">{e.eventType}</span>}
                      <h3>{e.title}</h3>
                      <div className="ev-loc">{[e.location, e.eventDate ? formatDate(e.eventDate) : null].filter(Boolean).join(' · ')}</div>
                      {e.description && <p>{e.description}</p>}
                      <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                        {e.externalUrl && (
                          <a
                            className="ic-link"
                            href={safeUrl(e.externalUrl)}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Event page →
                          </a>
                        )}
                        {(e.fullDescription || e.image) && (
                          <Link className="ic-link" to={`/event/${e.id}`}>
                            Details →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}