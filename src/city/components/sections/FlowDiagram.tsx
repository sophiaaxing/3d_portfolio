import type { FlowStep } from '../../data/caseStudies';

/** A simple numbered flow: steps left to right on wide screens, top to bottom on narrow ones. */
export function FlowDiagram({ caption, steps }: { caption: string; steps: FlowStep[] }) {
  return (
    <figure className="flow">
      <ol className="flow__steps" style={{ ['--steps' as string]: steps.length }}>
        {steps.map((step, i) => (
          <li key={step.label} className="flow__step">
            <span className="flow__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="flow__label">{step.label}</span>
            <span className="flow__note">{step.note}</span>
          </li>
        ))}
      </ol>
      <figcaption className="flow__caption">{caption}</figcaption>
    </figure>
  );
}
