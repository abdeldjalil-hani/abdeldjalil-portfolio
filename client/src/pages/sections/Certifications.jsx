import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import { formatDate, safeUrl } from '../../utils/helpers';

export default function Certifications({ certifications = [] }) {
  const list = certifications.filter((c) => c.isPublished !== false);

  if (list.length === 0) return null;

  return (
    <section className="section" id="certifications">
      <div className="container">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          lead="Certifications and professional credentials."
        />
        <div className="cards-grid">
          {list.map((c) => (
            <Reveal key={c.id}>
              <div className="info-card">
                <h3>{c.title}</h3>
                <div className="ic-org">{c.organization}</div>
                <div className="ic-date">{c.date ? formatDate(c.date) : ''}</div>
                {c.description && <p>{c.description}</p>}
                {c.credentialUrl && (
                  <a
                    className="ic-link"
                    href={safeUrl(c.credentialUrl)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View credential →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}