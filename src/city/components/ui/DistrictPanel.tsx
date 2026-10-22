import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { caseStudyFor } from '../../data/caseStudies';
import { districtById, neighbour, type DistrictId } from '../../data/districts';
import { itemById, itemsIn, neighbourItem } from '../../data/items';
import { CITY_BASE, pathForCaseStudy } from '../../routing';
import { cityStore, useCity } from '../../state/cityStore';

const listHeading: Partial<Record<DistrictId, string>> = {
  lab: 'In the lab',
  studio: 'In the studio',
};

/** Where a place leads when it has no case study of its own. */
const pageLinks: Partial<Record<DistrictId, { to: string; label: string }>> = {
  rice: { to: `${CITY_BASE}/about#education`, label: 'Education & more' },
  lab: { to: `${CITY_BASE}/projects`, label: 'All projects' },
  studio: { to: `${CITY_BASE}/about`, label: 'More about me' },
};

/** The way from the panel into the full story: a case study, or the page that covers this place. */
function PanelLink({ place, item, tab }: { place: DistrictId; item: string | null; tab: number }) {
  const study = caseStudyFor(place, item);
  const link = study ? { to: pathForCaseStudy(study), label: 'Read the case study' } : item ? undefined : pageLinks[place];
  if (!link) return null;
  return (
    <Link to={link.to} className="district-panel__cta" tabIndex={tab}>
      {link.label} <span aria-hidden="true">→</span>
    </Link>
  );
}

interface Shown {
  district: DistrictId;
  item: string | null;
}

/** Details for the selected place, or for an object inside it, shown beside the camera's close-up. */
export function DistrictPanel() {
  const selected = useCity((s) => s.selected);
  const openItem = useCity((s) => s.item);
  // Keep the last place on screen while the panel fades out.
  const [shown, setShown] = useState<Shown | null>(selected ? { district: selected, item: openItem } : null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (selected) setShown({ district: selected, item: openItem });
  }, [selected, openItem]);

  const shownKey = shown ? `${shown.district}/${shown.item ?? ''}` : '';
  // Move focus to the heading once the panel for this place is on screen.
  useEffect(() => {
    if (selected && shownKey === `${selected}/${openItem ?? ''}`) heading.current?.focus({ preventScroll: true });
  }, [selected, openItem, shownKey]);

  if (!shown) return null;
  const open = Boolean(selected);
  const tab = open ? 0 : -1;

  return (
    <aside className="district-panel" data-open={open} aria-hidden={!open} aria-labelledby="district-panel-title">
      {/* Keyed so the text fades in again when moving between places. */}
      <div key={shownKey} className="district-panel__content">
        {shown.item ? (
          <ItemView id={shown.item} tab={tab} heading={heading} />
        ) : (
          <DistrictView id={shown.district} tab={tab} heading={heading} />
        )}
      </div>
    </aside>
  );
}

interface ViewProps<Id> {
  id: Id;
  tab: number;
  heading: RefObject<HTMLHeadingElement>;
}

/** A place: what it is, what's inside it, and the way to the next one. */
function DistrictView({ id, tab, heading }: ViewProps<DistrictId>) {
  const district = districtById[id];
  const inside = itemsIn(id);
  const previous = neighbour(id, -1);
  const next = neighbour(id, 1);
  return (
    <>
      <p className="district-panel__kicker">
        <span>
          {district.index} / {district.name}
        </span>
        {district.year && <span>{district.year}</span>}
      </p>
      <h2 id="district-panel-title" ref={heading} tabIndex={-1} className="district-panel__title">
        {district.name}
      </h2>
      <p className="district-panel__role">{district.role}</p>
      <p className="district-panel__summary">{district.summary}</p>
      <p className="district-panel__tags">{district.tags}</p>
      <PanelLink place={id} item={null} tab={tab} />

      {inside.length > 0 && (
        <div className="district-panel__items">
          <p className="district-panel__label">{listHeading[id] ?? 'Inside'}</p>
          <ul>
            {inside.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  tabIndex={tab}
                  onClick={() => cityStore.selectItem(item.id)}
                  onPointerEnter={() => cityStore.hoverItem(item.id)}
                  onPointerLeave={() => cityStore.unhoverItem(item.id)}
                >
                  <span>{item.name}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav className="district-panel__nav" aria-label="Other places">
        <button type="button" onClick={() => cityStore.select(previous.id)} tabIndex={tab}>
          <span aria-hidden="true">←</span> {previous.name}
        </button>
        <button type="button" onClick={() => cityStore.select(next.id)} tabIndex={tab}>
          {next.name} <span aria-hidden="true">→</span>
        </button>
      </nav>
      <button type="button" className="district-panel__close" onClick={() => cityStore.clear()} tabIndex={tab}>
        back to the city <kbd>esc</kbd>
      </button>
    </>
  );
}

/** One project or object: what it is, and a way back to the place it belongs to. */
function ItemView({ id, tab, heading }: ViewProps<string>) {
  const item = itemById[id];
  const district = districtById[item.district];
  const siblings = itemsIn(item.district);
  const previous = neighbourItem(id, -1);
  const next = neighbourItem(id, 1);
  return (
    <>
      <p className="district-panel__kicker">
        <span>
          {district.index} / {district.name}
        </span>
        <span>
          {siblings.findIndex((s) => s.id === id) + 1} of {siblings.length}
        </span>
      </p>
      <h2 id="district-panel-title" ref={heading} tabIndex={-1} className="district-panel__title">
        {item.name}
      </h2>
      <p className="district-panel__role">{item.kicker}</p>
      <p className="district-panel__summary">{item.summary}</p>
      {item.points && (
        <ul className="district-panel__points">
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
      {item.tags && <p className="district-panel__tags">{item.tags}</p>}
      <PanelLink place={item.district} item={id} tab={tab} />

      {siblings.length > 1 && (
        <nav className="district-panel__nav" aria-label={`More in ${district.name}`}>
          {/* With only two, previous and next are the same place; offer it once. */}
          {previous.id !== next.id ? (
            <button type="button" onClick={() => cityStore.selectItem(previous.id)} tabIndex={tab}>
              <span aria-hidden="true">←</span> {previous.name}
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={() => cityStore.selectItem(next.id)} tabIndex={tab}>
            {next.name} <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
      <button type="button" className="district-panel__close" onClick={() => cityStore.back()} tabIndex={tab}>
        back to {district.name} <kbd>esc</kbd>
      </button>
    </>
  );
}
