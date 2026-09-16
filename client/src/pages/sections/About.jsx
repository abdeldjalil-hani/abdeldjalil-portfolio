import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';

const TOPICS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Software Engineering',
  'Quantum Computing',
  'Research',
  'Teaching',
];

export default function About({ settings }) {
  const profileImg = settings.profile_image || '';
  const aboutText = (settings.about_text || 'I am a multidisciplinary researcher and engineer working across AI, data science, software development, and quantum computing. My work bridges academic research and practical systems engineering, with particular focus on applying modern computing techniques to real-world problems.')
    .split('\n');

  return (
    <section className="section section-alt" id="about">
      <div className="container">
        <SectionHeading
          eyebrow="About"
          title="Who I Am"
          lead="A multidisciplinary technical profile spanning AI, data science, research, and software development."
        />
        <div className="about-grid">
          <Reveal>
            <div className="profile-frame">
              {profileImg ? (
                <img src={profileImg} alt={settings.name || 'Profile photo'} loading="lazy" />
              ) : (
                <div className="placeholder" aria-label="Profile photo placeholder">
                  {((settings.name || 'AH')
                    .split(/\s+/)
                    .map((w) => w[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join(''))}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="about-text">
              {aboutText.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="about-tags">
                {TOPICS.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}