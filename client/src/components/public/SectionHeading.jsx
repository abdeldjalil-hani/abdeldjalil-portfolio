import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, lead, dark = false }) {
  return (
    <Reveal>
      <div className="section-head">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </Reveal>
  );
}