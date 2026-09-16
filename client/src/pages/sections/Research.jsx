import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';

const RESEARCH_AREAS = [
  {
    icon: 'QC',
    title: 'Quantum Computing',
    desc: 'Exploring quantum algorithms and architectures for near-term and fault-tolerant computing systems.',
  },
  {
    icon: 'QML',
    title: 'Quantum Machine Learning',
    desc: 'Applying quantum techniques to accelerate or enhance machine learning models.',
  },
  {
    icon: 'QM',
    title: 'Quantum Metaheuristics',
    desc: 'Developing hybrid optimization strategies that combine quantum and classical approaches.',
  },
  {
    icon: 'AH',
    title: 'AI for Healthcare',
    desc: 'Using AI to solve real-world problems in health diagnostics and medical decision support.',
  },
  {
    icon: 'QE',
    title: 'Quantum Data Encoding',
    desc: 'Investigating efficient ways to represent classical data in quantum systems.',
  },
  {
    icon: 'QIP',
    title: 'Quantum Image Processing',
    desc: 'Exploring image processing techniques built on quantum computing primitives.',
  },
];

export default function Research({ settings }) {
  const phdText =
    settings.research_summary ||
    settings.reseach_summary ||
    'My PhD research focuses on optimizing complex health problems using quantum metaheuristics and quantum computing. This work explores how quantum-inspired and quantum-hybrid optimization techniques can solve combinatorial and constraint-heavy problems in healthcare more effectively than classical approaches.';

  return (
    <section className="section-dark section" id="research">
      <div className="container">
        <SectionHeading
          eyebrow="Research"
          title="Research Focus"
          lead={phdText}
          dark
        />

        <div className="research-phd">
          <span className="badge">PhD Research</span>
          <h3>Optimization of Complex Health Problems Using Quantum Metaheuristics and Quantum Computing</h3>
          <p>
            Investigating how quantum-inspired and quantum-computing methods can outperform classical
            approaches on hard combinatorial problems in healthcare, with focus on encoding strategies,
            hybrid quantum-classical optimization, and practical evaluation against real datasets.
          </p>
        </div>

        <div className="research-cards">
          {RESEARCH_AREAS.map((r) => (
            <Reveal key={r.title}>
              <div className="research-card">
                <div className="rc-icon" style={{
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '0.04em',
                }}>{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}