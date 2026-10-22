import { useEffect, useRef, useState } from 'react';
import type { Page } from '../../routing';
import { CasePage } from './CasePage';
import { AboutPage, ProjectsIndex, WorkIndex } from './IndexPages';

const pageKey = (page: Page) => (page.kind === 'case' ? `case/${page.id}` : page.kind);

function PageContent({ page }: { page: Page }) {
  switch (page.kind) {
    case 'case':
      return <CasePage id={page.id} />;
    case 'work':
      return <WorkIndex />;
    case 'projects':
      return <ProjectsIndex />;
    case 'about':
      return <AboutPage />;
  }
}

interface PageLayerProps {
  page: Page | null;
  /** Where on screen the page opens from, as a CSS position. */
  origin: string;
  /** Pause before the reveal, to let the camera start its move first. */
  delay: number;
  /** True on first load straight into a page: show it without the reveal. */
  instant: boolean;
}

/**
 * The paper layer that pages sit on. It opens out from a point on screen (the
 * building a case study belongs to) and folds back into it when closed.
 */
export function PageLayer({ page, origin, delay, instant }: PageLayerProps) {
  const [shown, setShown] = useState<Page | null>(page);
  const [open, setOpen] = useState(Boolean(page) && instant);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page) {
      setShown(page);
      // Let the closed state paint first so the reveal can transition.
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      return () => cancelAnimationFrame(frame);
    }
    setOpen(false);
    const timer = window.setTimeout(() => setShown(null), 700);
    return () => window.clearTimeout(timer);
  }, [page]);

  const key = shown ? pageKey(shown) : '';
  // New page: start at the top (or at the linked section) and move focus to its heading.
  useEffect(() => {
    const layer = scroller.current;
    if (!key || !page || !layer) return;
    layer.scrollTo({ top: 0 });
    layer.querySelector<HTMLElement>('[data-page-heading]')?.focus({ preventScroll: true });
    const anchor = window.location.hash && layer.querySelector<HTMLElement>(window.location.hash);
    if (!anchor) return;
    const timer = window.setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }), instant ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [key, page, instant]);

  if (!shown) return null;
  return (
    <div
      ref={scroller}
      className="city-page"
      data-open={open}
      data-instant={instant}
      style={{ ['--origin' as string]: origin, ['--reveal-delay' as string]: `${delay}s` }}
      aria-hidden={!page}
    >
      <main key={key} className="city-page__inner">
        <PageContent page={shown} />
      </main>
    </div>
  );
}
