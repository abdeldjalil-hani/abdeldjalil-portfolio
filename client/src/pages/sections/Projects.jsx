import { Link } from 'react-router-dom';
import Reveal from '../../components/public/Reveal';
import SectionHeading from '../../components/public/SectionHeading';
import ImageCarousel from '../../components/public/ImageCarousel';
import Icon from '../../components/Icon';
import { excerpt } from '../../utils/helpers';

function getProjectImages(p) {
  if (Array.isArray(p.images) && p.images.length > 0) return p.images;
  if (p.image) return [p.image];
  return [];
}

function getProjectCategories(p) {
  const cats = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : [];
  if (cats.length === 0 && p.category) cats.push(p.category);
  return cats;
}

export default function Projects({ projects = [] }) {
  const list = projects.filter((p) => p.isPublished !== false);

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeading
          eyebrow="Work"
          title="Projects"
          lead="Selected projects across AI, machine learning, data science, software development, and quantum computing."
        />

        {list.length === 0 ? (
          <Reveal>
            <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
              Projects will appear here once added from the admin dashboard.
            </p>
          </Reveal>
        ) : (
          <div className="project-grid">
            {list.map((p) => (
              <Reveal key={p.id}>
                <div className="project-card-wrap">
                  {p.isFeatured && <span className="featured-flag">Featured</span>}
                  <Link to={`/project/${p.slug}`} className="project-card">
                    <div className="project-thumb">
                      {(() => {
                        const imgs = getProjectImages(p);
                        return imgs.length > 0 ? (
                          <ImageCarousel images={imgs} alt={p.title} />
                        ) : (
                          <div className="no-img">{p.title?.slice(0, 2)?.toUpperCase()}</div>
                        );
                      })()}
                    </div>
                    <div className="project-body">
                      {getProjectCategories(p).length > 0 && (
                        <div className="project-cats">
                          {getProjectCategories(p).map((c) => (
                            <span className="project-cat" key={c}>{c}</span>
                          ))}
                        </div>
                      )}
                      <h3>{p.title}</h3>
                      <p>{excerpt(p.shortDescription || p.description, 140)}</p>
                      {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                        <div className="project-tech">
                          {p.technologies.slice(0, 5).map((t) => (
                            <span className="tech-chip" key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="project-links">
                        {p.githubUrl && (
                          <span><Icon name="github" size={15} /> Code</span>
                        )}
                        {p.demoUrl && (
                          <span><Icon name="globe" size={15} /> Demo</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}