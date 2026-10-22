import { Link } from 'react-router-dom';
import { caseStudyById, nextCaseStudy } from '../../data/caseStudies';
import { districtById } from '../../data/districts';
import { pathForCaseStudy, pathForSelection } from '../../routing';
import { FlowDiagram } from './FlowDiagram';
import { PageHeading } from './PageHeading';

/** An editorial case study: typography and rules rather than boxes. */
export function CasePage({ id }: { id: string }) {
  const study = caseStudyById[id];
  const next = nextCaseStudy(id);
  const place = districtById[study.place];
  const meta = [
    { label: 'Role', value: study.role },
    study.context && { label: 'Context', value: study.context },
    study.year && { label: 'Year', value: study.year },
    study.stack?.length && { label: 'Stack', value: study.stack.join(' · ') },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="page page--case">
      <p className="page__eyebrow">
        <span>{study.eyebrow}</span>
        {study.year && <span>{study.year}</span>}
      </p>
      <PageHeading className="page__title">{study.title}</PageHeading>

      <dl className="page__meta">
        {meta.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {study.sections.map((section) => (
        <section key={section.heading} className="page__section">
          <h2 className="page__section-title">{section.heading}</h2>
          <div className="page__section-body">
            {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.list && (
              <ul className="page__list">
                {section.list.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            )}
            {section.flow && <FlowDiagram {...section.flow} />}
          </div>
        </section>
      ))}

      <nav className="page__footer" aria-label="Case studies">
        <Link to={pathForSelection({ selected: study.place, item: study.item ?? null })}>
          <span aria-hidden="true">←</span> back to {place.name} in the city
        </Link>
        <Link to={pathForCaseStudy(next)} className="page__next">
          <span className="page__next-label">Next</span>
          <span className="page__next-title">
            {next.title} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
