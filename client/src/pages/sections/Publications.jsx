import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import { useState } from 'react';
import { safeUrl } from '../../utils/helpers';

const STATUS_LABELS = {
  published: 'Published',
  in_review: 'In Review',
  preprint: 'Preprint',
  submitted: 'Submitted',
};

export default function Publications({ publications = [] }) {
  const list = publications.filter((p) => p.isPublished !== false);
  const [openAbstract, setOpenAbstract] = useState(null);

  return (
    <section className="section" id="publications">
      <div className="container">
        <SectionHeading
          eyebrow="Academic"
          title="Publications"
          lead="Selected research publications and academic contributions."
        />

        {list.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Publications will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="pub-list">
            {list.map((p) => (
              <Reveal key={p.id}>
                <div className="pub-item">
                  {p.year && (
                    <div className="pub-year" style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}>
                      {p.year}
                    </div>
                  )}
                  <div className="pub-meta">
                    {p.status && p.status !== 'published' && (
                      <span className="pub-type">{STATUS_LABELS[p.status] || p.status}</span>
                    )}
                    <h3>{p.title}</h3>
                    <div className="authors">{p.authors}</div>
                    {p.venue && <div className="venue">{p.venue}</div>}
                    <div className="pub-links">
                      {p.externalUrl && (
                        <a href={safeUrl(p.externalUrl)} target="_blank" rel="noreferrer noopener">
                          View Paper
                        </a>
                      )}
                      {p.pdfUrl && (
                        <a href={safeUrl(p.pdfUrl)} target="_blank" rel="noreferrer noopener">
                          PDF
                        </a>
                      )}
                      {p.doi && (
                        <a
                          href={`https://doi.org/${p.doi}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          DOI
                        </a>
                      )}
                      {p.abstract && (
                        <button
                          type="button"
                          className="pub-abstract-toggle"
                          onClick={() => setOpenAbstract((cur) => (cur === p.id ? null : p.id))}
                        >
                          {openAbstract === p.id ? 'Hide Abstract' : 'Abstract'}
                        </button>
                      )}
                    </div>
                    {p.abstract && openAbstract === p.id && (
                      <div className="pub-abstract">{p.abstract}</div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}