import Icon from '../../components/Icon';
import Reveal from '../../components/public/Reveal';
import { safeUrl } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const SOCIAL_ICON_MAP = {
  github: 'github',
  linkedin: 'linkedin',
  email: 'mail',
  x: 'x',
  twitter: 'x',
  instagram: 'instagram',
  website: 'globe',
};

function CodeLine({ ind, children }) {
  return (
    <div style={{ paddingLeft: ind * 18 }}>
      {children}
    </div>
  );
}

function CodeCard() {
  return (
    <div className="hero-card" dir="ltr">
      <div className="hero-card-top">
        <span /><span /><span />
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.9, color: 'var(--text-soft)' }}>
        <CodeLine ind={0}><span className="kw">//</span> research + applied AI</CodeLine>
        <CodeLine ind={0}><span className="kw">const</span> <span className="fn">phd</span> = {'{'}</CodeLine>
        <CodeLine ind={1}>focus: <span className="st">'quantum metaheuristics'</span>,</CodeLine>
        <CodeLine ind={1}>domain: <span className="st">'complex health problems'</span>,</CodeLine>
        <CodeLine ind={1}>toolbox: [<span className="fn">QML</span>, <span className="fn">QC</span>, <span className="fn">AI</span>],</CodeLine>
        <CodeLine ind={1}>build: <span className="fn">React</span> + <span className="fn">Node</span> + <span className="fn">MySQL</span>,</CodeLine>
        <CodeLine ind={0}>{'};'}</CodeLine>
        <CodeLine ind={0} />
        <CodeLine ind={0}><span className="kw">while</span> (<span className="fn">research</span>) {'{'}</CodeLine>
        <CodeLine ind={1}><span className="fn">experiment</span>();</CodeLine>
        <CodeLine ind={1}><span className="fn">learn</span>();</CodeLine>
        <CodeLine ind={1}><span className="fn">publish</span>();</CodeLine>
        <CodeLine ind={0}>{'}'}</CodeLine>
      </div>
    </div>
  );
}

export default function Hero({ settings, socialLinks = [] }) {
  const name = settings.name || 'Abdeldjalil Hani';
  const roles =
    settings.hero_subheading ||
    settings.title_line_2 ||
    'AI & Machine Learning Engineer / Data Scientist / PhD Researcher / Software Developer';
  const intro =
    settings.hero_introduction ||
    settings.introduction ||
    'PhD researcher and AI/ML engineer working at the intersection of artificial intelligence, data science, software development, and emerging computing technologies.';

  const socials = (socialLinks || []).filter((s) => s.url);

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <Reveal>
            <span className="hero-eyebrow">
              <span className="dot" />
              AI Researcher &amp; Engineer
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1>{name}</h1>
            <p className="roles">{roles}</p>
            <p className="intro">{intro}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="hero-cta">
              <Link to="/#projects" className="btn btn-primary">
                View My Work
              </Link>
              {settings.cv_url ? (
                <a href={safeUrl(settings.cv_url)} className="btn btn-dark" target="_blank" rel="noreferrer noopener">
                  Download CV
                </a>
              ) : (
                <Link to="/#contact" className="btn btn-dark">
                  Download CV
                </Link>
              )}
              <Link to="/#contact" className="btn btn-outline">
                Contact Me
              </Link>
            </div>
          </Reveal>

          {socials.length > 0 && (
            <Reveal delay={180}>
              <div className="hero-social">
                {socials.map((s) => (
                  <a
                    key={s.id || s.platform}
                    href={safeUrl(s.url)}
                    className="btn btn-sm btn-outline"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.platform}
                  >
                    <Icon name={SOCIAL_ICON_MAP[s.platform] || s.icon || 'globe'} size={17} />
                    {s.username ? `@${s.username}` : s.platform}
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={160}>
          <div className="hero-visual" aria-hidden="true">
            <CodeCard />
          </div>
        </Reveal>
      </div>
    </section>
  );
}