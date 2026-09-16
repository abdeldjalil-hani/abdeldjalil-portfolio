import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';

const ICONS = { code: 'Generic', brain: 'AI', globe: 'Web', chart: 'Data', flask: 'Research' };

export default function Skills({ skillCategories = [] }) {
  const cats = (skillCategories || []).filter((c) => c.skills && c.skills.length > 0);

  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <SectionHeading
          eyebrow="Toolbox"
          title="Skills"
          lead="Technologies and tools I work with across research, AI, data, web, and software."
        />
        {cats.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Skills will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="skills-grid">
            {cats.map((c) => (
              <Reveal key={c.id}>
                <div className="skill-cat">
                  <div className="sc-icon">{c.icon ? c.icon.slice(0, 2).toUpperCase() : (ICONS[c.icon] || '').slice(0, 2)}</div>
                  <h3>{c.name}</h3>
                  <div className="skill-chips">
                    {c.skills.map((s) => (
                      <span className="skill-chip" key={s.id}>{s.name}</span>
                    ))}
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