import { Link } from 'react-router-dom';
import { districts } from '../../data/districts';
import { nav, site } from '../../data/site';
import type { TimePhase } from '../../hooks/useTimeOfDay';
import { cityStore, useCity, type TimeMode } from '../../state/cityStore';

export function SxMark({ className = '' }: { className?: string }) {
  return <span className={`sx-mark ${className}`} aria-hidden="true" />;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const TIME_MODES: TimeMode[] = ['auto', 'day', 'evening', 'night'];
const TIME_ICONS: Record<TimePhase, string> = { day: '☼', evening: '◐', night: '☾' };

/** Cycles auto → day → evening → night. Auto follows the visitor's own clock. */
function TimeToggle({ timeOfDay }: { timeOfDay: TimePhase }) {
  const mode = useCity((s) => s.timeMode);
  const next = TIME_MODES[(TIME_MODES.indexOf(mode) + 1) % TIME_MODES.length];
  const label = mode === 'auto' ? `${timeOfDay}, from your clock` : timeOfDay;
  return (
    <button
      type="button"
      className="city-nav__time"
      onClick={() => cityStore.setTimeMode(next)}
      aria-label={`Time of day: ${label}. Switch to ${next === 'auto' ? 'your local time' : next}.`}
      title={`Time of day: ${label}`}
    >
      <span aria-hidden="true">{TIME_ICONS[timeOfDay]}</span>
      <span className="city-nav__time-label" aria-hidden="true">
        {mode === 'auto' ? 'auto' : timeOfDay}
      </span>
    </button>
  );
}

interface NavProps {
  /** Which nav entry the current page belongs to. */
  current: string;
  timeOfDay: TimePhase;
  onOpenPalette: () => void;
}

export function Nav({ current, timeOfDay, onOpenPalette }: NavProps) {
  return (
    <nav className="city-nav" aria-label="Primary">
      <Link to="/" className="city-nav__mark" aria-label={`${site.name}, home`}>
        <SxMark />
      </Link>
      <ul className="city-nav__links">
        {nav.map((item) => (
          <li key={item.id} className={item.hideOnMobile ? 'hide-sm' : undefined}>
            {item.external ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : (
              <Link to={item.href} aria-current={item.id === current ? 'page' : undefined}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
        <li>
          <TimeToggle timeOfDay={timeOfDay} />
        </li>
        <li className="hide-sm">
          <button type="button" className="city-nav__palette" onClick={onOpenPalette} aria-label="Search and jump anywhere" aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}>
            {isMac ? '⌘' : 'Ctrl'} K
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function Identity() {
  return (
    <header className="city-identity reveal">
      <h1 className="city-identity__name">{site.name}</h1>
      <p className="city-identity__roles">{site.roles.join(' · ')}</p>
      <button type="button" className="city-identity__explore" onClick={() => cityStore.select(districts[0].id)}>
        explore my world <span aria-hidden="true">→</span>
      </button>
    </header>
  );
}

/**
 * An architectural-model key: the fastest way to see where Sophia has worked,
 * and a keyboard-friendly way to visit every place in the world.
 */
export function DistrictKey() {
  const hovered = useCity((s) => s.hovered);
  return (
    <aside id="places" tabIndex={-1} className="city-key reveal" aria-label="Places in this world">
      <p className="city-key__title">
        <span>index</span>
        <span>{String(districts.length).padStart(2, '0')} places</span>
      </p>
      <ol>
        {districts.map((district) => (
          <li key={district.id}>
            <button
              type="button"
              data-district={district.id}
              data-hovered={hovered === district.id}
              onClick={() => cityStore.select(district.id)}
              onPointerEnter={() => cityStore.hover(district.id)}
              onPointerLeave={() => cityStore.unhover(district.id)}
              onFocus={() => cityStore.hover(district.id)}
              onBlur={() => cityStore.unhover(district.id)}
            >
              <span className="city-key__num">{district.index}</span>
              <span className="city-key__name">{district.name}</span>
              <span className="city-key__meta">{district.keyMeta}</span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function Hint({ visible, touch }: { visible: boolean; touch: boolean }) {
  return (
    <p className="city-hint" data-visible={visible} aria-hidden={!visible}>
      <span aria-hidden="true">⟲</span> drag to explore · {touch ? 'tap' : 'click'} a place
    </p>
  );
}

/** For keyboard users: straight past the nav to the places in the city. */
export function SkipLink() {
  return (
    <a className="city-skip" href="#places">
      Skip to the list of places
    </a>
  );
}

export function Loader({ visible }: { visible: boolean }) {
  return (
    <div className="city-loader" data-visible={visible} role="status" aria-live="polite">
      <SxMark className="sx-mark--large" />
      <p>
        constructing world<span className="city-loader__dots" aria-hidden="true" />
      </p>
    </div>
  );
}

export function WorldFallback() {
  return (
    <div className="city-fallback">
      <p>This browser can’t display the 3D world, but everything else is still here.</p>
    </div>
  );
}
