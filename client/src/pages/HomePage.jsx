import { useEffect, useState } from 'react';
import { publicApi } from '../api/client';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import Seo from '../components/Seo';
import Hero from './sections/Hero';
import About from './sections/About';
import Research from './sections/Research';
import Projects from './sections/Projects';
import Publications from './sections/Publications';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Teaching from './sections/Teaching';
import Certifications from './sections/Certifications';
import Events from './sections/Events';
import Skills from './sections/Skills';
import Contact from './sections/Contact';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    publicApi
      .bundle(controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Seo
        title={data?.settings?.meta_title || 'Abdeldjalil Hani — AI & Machine Learning Engineer, Data Scientist, PhD Researcher'}
        description={
          data?.settings?.meta_description ||
          'Portfolio of Abdeldjalil Hani: AI & Machine Learning Engineer, Data Scientist, PhD Researcher and Software Developer. Research, projects, publications, teaching and experience.'
        }
        image={data?.settings?.profile_image || ''}
      />
      <Navbar settings={data?.settings || {}} />
      <main>
        {error && (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-faint)' }}>
            Could not load content from the server. Please check that the API is running.
          </div>
        )}
        {!data && !error && (
          <div style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>
            Loading…
          </div>
        )}
        {data && (
          <>
            <Hero settings={data.settings || {}} socialLinks={data.socialLinks || []} />
            <About settings={data.settings || {}} />
            <Research settings={data.settings || {}} />
            <Projects projects={data.projects || []} />
            <Experience experiences={data.experiences || []} />
            <Education education={data.education || []} />
            <Publications publications={data.publications || []} />
            <Teaching teaching={data.teaching || []} />
            <Certifications certifications={data.certifications || []} />
            <Events events={data.events || []} />
            <Skills skillCategories={data.skillCategories || []} />
            <Contact settings={data.settings || {}} socialLinks={data.socialLinks || []} />
          </>
        )}
      </main>
      {data && <Footer settings={data.settings || {}} socialLinks={data.socialLinks || []} />}
    </>
  );
}