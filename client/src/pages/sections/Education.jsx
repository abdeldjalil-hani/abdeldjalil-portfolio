import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import { formatDateRange } from '../../utils/helpers';

export default function Education({ education = [] }) {
  const list = education.filter((e) => e.isPublished !== false);

  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHeading
          eyebrow="Academic"
          title="Education"
          lead="Academic background and degrees."
        />
        {list.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Education entries will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="timeline">
            {list.map((e) => (
              <Reveal key={e.id}>
                <div className="tl-item">
                  <h3>{e.degree}</h3>
                  <div className="tl-org">{e.institution}</div>
                  <div className="tl-period">
                    {formatDateRange(e.startDate, e.endDate, e.isCurrent)}
                    {e.field && <span className="tl-loc"> · {e.field}</span>}
                  </div>
                  {e.description && <p>{e.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}