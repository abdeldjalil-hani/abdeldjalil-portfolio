import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '../api/client';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import Seo from '../components/Seo';
import { formatDate, safeUrl } from '../utils/helpers';

export default function EventDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    publicApi
      .event(id)
      .then((r) => setData(r.event))
      .catch(setError);
  }, [id]);

  const ev = data;

  return (
    <>
      <Navbar settings={{}} />
      <Seo
        title={`${ev?.title || 'Event'} — Abdeldjalil Hani`}
        description={ev?.description || ''}
        image={ev?.image || ''}
      />
      <main>
        {error && (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-faint)' }}>
            {error.message || 'Event not found.'}
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-primary" to="/#events">Back to events</Link>
            </div>
          </div>
        )}
        {!data && !error && (
          <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>Loading…</div>
        )}
        {ev && (
          <>
            <section className="detail-hero">
              <div className="container">
                <div className="breadcrumbs">
                  <Link to="/">Home</Link> / <Link to="/#events">Events</Link>
                </div>
                {ev.eventType && <span className="event-type">{ev.eventType}</span>}
                <h1>{ev.title}</h1>
                <p style={{ color: 'var(--text-faint)' }}>
                  {ev.location ? `${ev.location} · ` : ''}
                  {ev.eventDate ? formatDate(ev.eventDate) : ''}
                  {ev.endDate ? ` — ${formatDate(ev.endDate)}` : ''}
                </p>
                {ev.description && <p style={{ color: 'var(--text-soft)', fontSize: 17, maxWidth: 720 }}>{ev.description}</p>}
                {ev.externalUrl && (
                  <a className="btn btn-primary" style={{ marginTop: 12 }} href={safeUrl(ev.externalUrl)} target="_blank" rel="noreferrer noopener">
                    Event page
                  </a>
                )}
              </div>
            </section>

            {ev.image && (
              <section className="container" style={{ marginBottom: 40 }}>
                <img
                  src={ev.image}
                  alt={ev.title}
                  style={{ borderRadius: 'var(--radius)', maxHeight: 480, width: '100%', objectFit: 'cover' }}
                />
              </section>
            )}

            {ev.fullDescription && (
              <section className="detail-body">
                <div className="container prose">
                  {(ev.fullDescription || '').split('\n').filter(Boolean).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer settings={{}} />
    </>
  );
}