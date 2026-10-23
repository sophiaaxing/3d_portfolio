import { Link } from 'react-router-dom';
import { about } from '../../data/about';
import { caseStudies, caseStudyFor } from '../../data/caseStudies';
import { currently } from '../../data/currently';
import { projects } from '../../data/projects';
import { site } from '../../data/site';
import { pathForCaseStudy, pathForSelection } from '../../routing';
import { PageHeading } from './PageHeading';

/** All the work, as a table of contents. */
export function WorkIndex() {
  const work = caseStudies.filter((study) => study.section === 'work');
  return (
    <article className="page">
      <p className="page__eyebrow">
        <span>Work</span>
        <span>{String(work.length).padStart(2, '0')} places</span>
      </p>
      <PageHeading className="page__title">Where I’ve worked</PageHeading>
      <ol className="page__index">
        {work.map((study) => (
          <li key={study.id}>
            <Link to={pathForCaseStudy(study)}>
              <span className="page__index-num">{study.eyebrow.split(' / ')[0]}</span>
              <span className="page__index-name">{study.eyebrow.split(' / ')[1]}</span>
              <span className="page__index-title">{study.title}</span>
              <span className="page__index-meta">
                {study.role} · {study.year}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}

/** Projects: those with a case study link to it; the rest open in the lab. */
export function ProjectsIndex() {
  return (
    <article className="page">
      <p className="page__eyebrow">
        <span>Projects</span>
        <span>{String(projects.length).padStart(2, '0')} so far</span>
      </p>
      <PageHeading className="page__title">Things I’ve built</PageHeading>
      <ol className="page__index">
        {projects.map((project, i) => {
          const study = caseStudyFor('lab', project.id);
          return (
            <li key={project.id}>
              <Link to={study ? pathForCaseStudy(study) : pathForSelection({ selected: 'lab', item: project.id })}>
                <span className="page__index-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="page__index-name">{project.name}</span>
                <span className="page__index-title">{project.summary}</span>
                <span className="page__index-meta">{study ? 'case study' : 'see it in the lab'}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="page__aside">Explore each project in the lab.</p>
    </article>
  );
}

/** About: short, human, and editorial rather than a biography. */
export function AboutPage() {
  const { education } = about;
  return (
    <article className="page page--about">
      <p className="page__eyebrow">
        <span>About</span>
        <span>{site.name}</span>
      </p>
      <PageHeading className="page__title">{about.lede}</PageHeading>
      <p className="page__statement">
        {about.statement.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      <section className="page__section">
        <h2 className="page__section-title">Currently</h2>
        <dl className="page__pairs">
          {currently.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Interested in</h2>
        <ul className="page__words">
          {about.interestedIn.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Elsewhere</h2>
        <dl className="page__pairs">
          {about.elsewhere.map(({ label, note }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page__section" id="education">
        <h2 className="page__section-title">Education</h2>
        <div className="page__section-body">
          <p>
            <strong>{education.school}</strong> · {education.degree}, {education.minor} · {education.year}
          </p>
          <p>Coursework: {education.coursework.join(', ')}.</p>
          <ul className="page__list">
            {education.involvement.map((role) => <li key={role}>{role}</li>)}
          </ul>
          <p>
            <Link to={pathForSelection({ selected: 'rice', item: null })} className="page__inline-link">
              See Rice in the city →
            </Link>
          </p>
        </div>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Technical skills</h2>
        <dl className="page__pairs">
          {Object.entries(about.skills).map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Say hello</h2>
        <ul className="page__links">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={site.resume} target="_blank" rel="noreferrer">
              résumé <span aria-hidden="true">↗</span>
            </a>
          </li>
          {site.links.linkedin && (
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
          )}
          {site.links.github && (
            <li>
              <a href={site.links.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </li>
          )}
        </ul>
      </section>
    </article>
  );
}
