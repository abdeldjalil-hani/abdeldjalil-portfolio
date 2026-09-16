import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '../api/client';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import ImageCarousel from '../components/public/ImageCarousel';
import Seo from '../components/Seo';
import Icon from '../components/Icon';
import { safeUrl } from '../utils/helpers';

function getProjectImages(project) {
  if (Array.isArray(project.images) && project.images.length > 0) return project.images;
  if (project.image) return [project.image];
  return [];
}

function getProjectCategories(project) {
  const cats = Array.isArray(project.categories) && project.categories.length > 0 ? project.categories : [];
  if (cats.length === 0 && project.category) cats.push(project.category);
  return cats;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    publicApi
      .project(slug)
      .then((r) => setData(r.project))
      .catch(setError);
  }, [slug]);

  const project = data;

  return (
    <>
      <Navbar settings={{}} />
      <Seo
        title={`${project?.title || 'Project'} — Abdeldjalil Hani`}
        description={project?.shortDescription || ''}
        image={project?.image || ''}
      />
      <main>
        {error && (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-faint)' }}>
            {error.message || 'Project not found.'}
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-primary" to="/#projects">Back to projects</Link>
            </div>
          </div>
        )}
        {!data && !error && (
          <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>Loading…</div>
        )}
        {project && (
          <>
            <section className="detail-hero">
              <div className="container">
                <div className="breadcrumbs">
                  <Link to="/">Home</Link> / <Link to="/#projects">Projects</Link>
                </div>
                {getProjectCategories(project).length > 0 && (
                  <div className="project-cats">
                    {getProjectCategories(project).map((c) => (
                      <span className="project-cat" key={c}>{c}</span>
                    ))}
                  </div>
                )}
                <h1>{project.title}</h1>
                {project.shortDescription && (
                  <p style={{ color: 'var(--text-soft)', fontSize: 17, maxWidth: 720 }}>{project.shortDescription}</p>
                )}
                {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                  <div className="project-tech" style={{ marginTop: 16 }}>
                    {project.technologies.map((t) => (
                      <span className="tech-chip" key={t}>{t}</span>
                    ))}
                  </div>
                )}
                <div className="hero-cta" style={{ marginTop: 24 }}>
                  {project.githubUrl && (
                    <a className="btn btn-outline" href={safeUrl(project.githubUrl)} target="_blank" rel="noreferrer noopener">
                      <Icon name="github" size={17} /> GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a className="btn btn-primary" href={safeUrl(project.demoUrl)} target="_blank" rel="noreferrer noopener">
                      Live demo
                    </a>
                  )}
                  {project.publicationUrl && (
                    <a className="btn btn-outline" href={safeUrl(project.publicationUrl)} target="_blank" rel="noreferrer noopener">
                      Publication
                    </a>
                  )}
                </div>
              </div>
            </section>

            {(() => {
              const imgs = getProjectImages(project);
              return imgs.length > 0 ? (
                <section className="container carousel-detail" style={{ marginBottom: 40 }}>
                  <ImageCarousel images={imgs} alt={project.title} interval={4000} />
                </section>
              ) : null;
            })()}

            <section className="detail-body">
              <div className="container prose">
                {(project.description || '').split('\n').filter(Boolean).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer settings={{}} />
    </>
  );
}