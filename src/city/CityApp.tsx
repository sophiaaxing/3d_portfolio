import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { caseStudyById } from './data/caseStudies';
import { districtById, neighbour, type DistrictId } from './data/districts';
import { itemById, neighbourItem } from './data/items';
import { PageLayer } from './components/sections/PageLayer';
import { CommandPalette } from './components/ui/CommandPalette';
import { DistrictPanel } from './components/ui/DistrictPanel';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { DistrictKey, Hint, Identity, Loader, Nav, SkipLink, WorldFallback } from './components/ui/Overlay';
import { useCityRouting } from './hooks/useCityRouting';
import { useTimeOfDay } from './hooks/useTimeOfDay';
import { useIsMobile, useIsTouch, usePrefersReducedMotion } from './hooks/useMediaQuery';
import { useWebGLSupport } from './hooks/useWebGLSupport';
import { parseCityPath, pathForSelection, type Page } from './routing';
import { cityStore, useCity } from './state/cityStore';
import './styles/city.css';

const World = lazy(() => import('./components/world/World'));

type Phase = 'loading' | 'intro' | 'ready';

/** How long a page takes to cover the world; after that the world stops rendering. */
const PAGE_COVER_MS = 1600;

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** Where closing a page goes: back to the place a case study came from, or to wherever the city was. */
function closePathFor(page: Page) {
  if (page.kind === 'case') {
    const study = caseStudyById[page.id];
    return study.place ? pathForSelection({ selected: study.place, item: study.item ?? null }) : '/city/work';
  }
  return pathForSelection(cityStore.get());
}

/**
 * Keyboard: ⌘K / Ctrl+K opens the palette. Escape steps back (page → place,
 * object → place → city); arrow keys step through objects or places.
 */
function useKeyboard(page: Page | null, togglePalette: () => void) {
  const navigate = useNavigate();
  const pageRef = useRef(page);
  pageRef.current = page;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        togglePalette();
        return;
      }
      if (event.defaultPrevented || isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (pageRef.current) {
        if (event.key === 'Escape') navigate(closePathFor(pageRef.current));
        return;
      }
      const { selected, item } = cityStore.get();
      if (!selected) return;
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (event.key === 'Escape') cityStore.back();
      else if (step && item) cityStore.selectItem(neighbourItem(item, step).id);
      else if (step) cityStore.select(neighbour(selected, step).id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, togglePalette]);
}

/** When a place closes after keyboard use, put focus back on its entry in the index. */
function useReturnFocus() {
  const selected = useCity((s) => s.selected);
  const last = useRef(selected);
  const usingKeyboard = useRef(false);

  useEffect(() => {
    const onKey = () => {
      usingKeyboard.current = true;
    };
    const onPointer = () => {
      usingKeyboard.current = false;
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('pointerdown', onPointer, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);

  useEffect(() => {
    if (!selected && last.current && usingKeyboard.current) {
      document.querySelector<HTMLElement>(`.city-key button[data-district="${last.current}"]`)?.focus();
    }
    last.current = selected;
  }, [selected]);
}

const SITE_TITLE = 'Sophia Xing';
const PAGE_TITLES = { work: 'Work', projects: 'Projects', about: 'About' };

/** The browser tab title for what's on screen. */
function titleFor(page: Page | null, selected: DistrictId | null, item: string | null) {
  if (page) return `${page.kind === 'case' ? caseStudyById[page.id].title : PAGE_TITLES[page.kind]} — ${SITE_TITLE}`;
  if (!selected) return SITE_TITLE;
  const place = districtById[selected].name;
  return item ? `${itemById[item].name} · ${place} — ${SITE_TITLE}` : `${place} — ${SITE_TITLE}`;
}

/** The nav entry a page belongs to. */
function navSection(page: Page | null) {
  if (!page) return 'index';
  return page.kind === 'case' ? caseStudyById[page.id].section : page.kind;
}

export default function CityApp() {
  const location = useLocation();
  // A deep link (a place, an object, or a page) skips the intro and opens straight onto it.
  const [initial] = useState(() => {
    const route = parseCityPath(location.pathname);
    if (route.selection) cityStore.restore(route.selection);
    return route;
  });
  const { page } = useCityRouting();

  const webgl = useWebGLSupport();
  const isMobile = useIsMobile();
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>(webgl ? 'loading' : 'ready');
  const [interacted, setInteracted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [instantPage, setInstantPage] = useState(Boolean(initial.page));
  const [paused, setPaused] = useState(Boolean(initial.page));
  const timeOfDay = useTimeOfDay();
  const selected = useCity((s) => s.selected);
  const item = useCity((s) => s.item);
  const hovering = useCity((s) => s.hovered !== null);
  const world = useRef<HTMLDivElement>(null);

  const togglePalette = useCallback(() => setPaletteOpen((open) => !open), []);
  useKeyboard(page, togglePalette);
  useReturnFocus();

  // While the city is open it uses its own favicon, and restores the site's on the way out.
  useEffect(() => {
    const previousTitle = document.title;
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const previousIcon = icon?.href;
    if (icon) icon.href = '/city/favicon.png';
    return () => {
      document.title = previousTitle;
      if (icon && previousIcon) icon.href = previousIcon;
      cityStore.reset();
    };
  }, []);

  useEffect(() => {
    document.title = titleFor(page, selected, item);
  }, [page, selected, item]);

  useEffect(() => {
    if (selected) setInteracted(true);
  }, [selected]);

  // Without a 3D world there is no intro to wait for; the index and panel still work.
  useEffect(() => {
    if (!webgl) cityStore.setReady(true);
  }, [webgl]);

  // Stop rendering the world once a page covers it; start again as soon as it closes.
  useEffect(() => {
    if (!page) {
      setPaused(false);
      setInstantPage(false);
      return;
    }
    const timer = window.setTimeout(() => setPaused(true), instantPage ? 0 : PAGE_COVER_MS);
    return () => window.clearTimeout(timer);
  }, [page, instantPage]);

  // While a page is open, the world behind it is out of reach for keyboards and screen readers.
  // Back in the city, focus returns to the open place's panel, if there is one.
  const hadPage = useRef(Boolean(page));
  useEffect(() => {
    world.current?.toggleAttribute('inert', Boolean(page));
    if (!page && hadPage.current) {
      document.querySelector<HTMLElement>('.district-panel[data-open="true"] .district-panel__title')?.focus({ preventScroll: true });
    }
    hadPage.current = Boolean(page);
  }, [page]);

  const handleLoaded = useCallback(() => setPhase((p) => (p === 'loading' ? 'intro' : p)), []);
  const handleIntroComplete = useCallback(() => setPhase('ready'), []);
  const handleInteract = useCallback(() => setInteracted(true), []);
  const handleWorldError = useCallback(() => {
    setPhase('ready');
    cityStore.setReady(true);
  }, []);

  const playIntro = !reducedMotion && !initial.page && !initial.selection?.selected;

  return (
    <div
      className="city"
      data-phase={phase}
      data-reduced-motion={reducedMotion}
      data-selected={Boolean(selected)}
      data-page={Boolean(page)}
      data-time={timeOfDay}
    >
      {/* Nav first in the tab order; the skip link jumps past it to the places. */}
      {!page && <SkipLink />}
      <Nav current={navSection(page)} timeOfDay={timeOfDay} onOpenPalette={togglePalette} />
      <div ref={world} className="city-world" aria-hidden={Boolean(page)}>
        <div
          className="city-stage"
          data-hovering={hovering}
          role="img"
          aria-label="A miniature city model of Sophia’s world, with districts for Google, NVIDIA, AWS, Rice University, a project lab, and her studio."
        >
          {webgl ? (
            <ErrorBoundary fallback={<WorldFallback />} onError={handleWorldError}>
              <Suspense fallback={null}>
                <World
                  isMobile={isMobile}
                  reducedMotion={reducedMotion}
                  playIntro={playIntro}
                  pushIn={page?.kind === 'case'}
                  paused={paused}
                  timeOfDay={timeOfDay}
                  onLoaded={handleLoaded}
                  onIntroComplete={handleIntroComplete}
                  onInteract={handleInteract}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <WorldFallback />
          )}
        </div>
        <div className="city-grain" aria-hidden="true" />
        <Identity />
        <DistrictKey />
        <DistrictPanel />
        <Hint visible={phase === 'ready' && !interacted && webgl && !page} touch={isTouch} />
      </div>
      {/* A case study opens out of its building as the camera pushes in; other pages unfold from the nav. */}
      <PageLayer
        page={page}
        origin={page?.kind === 'case' ? '50% 50%' : '50% 0%'}
        delay={page?.kind === 'case' ? 0.45 : 0.05}
        instant={instantPage}
      />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Loader visible={phase === 'loading' && !page} />
    </div>
  );
}
