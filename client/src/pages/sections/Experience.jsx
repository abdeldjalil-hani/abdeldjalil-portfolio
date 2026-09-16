import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import { formatDateRange } from '../../utils/helpers';

export default function Experience({ experiences = [] }) {
  const list = experiences.filter((e) => e.isPublished !== false);

  return (
    <section className="section section-alt" id="experience">
      <div className="container">
        <SectionHeading
          eyebrow="Career"
          title="Experience"
          lead="Professional, research, and teaching experience."
        />
        {list.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Experience entries will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="timeline">
            {list.map((e) => (
              <Reveal key={e.id}>
                <div className="tl-item">
                  <h3>{e.position}</h3>
                  <div className="tl-org">{e.organization}</div>
                  <div className="tl-period">
                    {formatDateRange(e.startDate, e.endDate, e.isCurrent)}
                    {e.location && <span className="tl-loc"> · {e.location}</span>}
                  </div>
                  {e.type && <div className="tl-type">{e.type}</div>}
                  {e.description && <p>{e.description}</p>}
                  {Array.isArray(e.technologies) && e.technologies.length > 0 && (
                    <div className="project-tech">
                      {e.technologies.map((t) => (
                        <span className="tech-chip" key={t}>{t}</span>
                      ))}
                    </div>
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