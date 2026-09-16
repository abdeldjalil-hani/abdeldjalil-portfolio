import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import { formatDate, safeUrl, excerpt } from '../../utils/helpers';

export default function Teaching({ teaching = [] }) {
  const list = teaching.filter((t) => t.isPublished !== false);

  return (
    <section className="section section-alt" id="teaching">
      <div className="container">
        <SectionHeading
          eyebrow="Sharing Knowledge"
          title="Teaching & Training"
          lead="University teaching, workshops, and AI/ML training sessions I have delivered."
        />
        {list.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Teaching and training activities will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="cards-grid">
            {list.map((t) => (
              <Reveal key={t.id}>
                <div className="info-card">
                  <div className="ic-thumb">
                    {t.image ? (
                      <img src={t.image} alt={t.title} loading="lazy" />
                    ) : (
                      <div className="no-img">{t.title?.slice(0, 2)?.toUpperCase()}</div>
                    )}
                  </div>
                  <h3>{t.title}</h3>
                  <div className="ic-org">{t.organization}</div>
                  <div className="ic-date">
                    {t.date ? formatDate(t.date) : ''}
                    {t.audience ? ` · Audience: ${t.audience}` : ''}
                  </div>
                  {t.description && <p>{excerpt(t.description, 150)}</p>}
                  {t.externalUrl && (
                    <a
                      className="ic-link"
                      href={safeUrl(t.externalUrl)}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}