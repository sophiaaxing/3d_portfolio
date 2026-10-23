import { caseStudyById, type CaseStudy } from './data/caseStudies';
import { districtById, type DistrictId } from './data/districts';
import { itemById } from './data/items';

export const CITY_BASE = '/city';

export type Page = { kind: 'work' } | { kind: 'projects' } | { kind: 'about' } | { kind: 'case'; id: string };

export interface Selection {
  selected: DistrictId | null;
  item: string | null;
}

export interface CityRoute {
  /** The place the URL asks for; null when the URL leaves the current selection alone. */
  selection: Selection | null;
  page: Page | null;
}

const overview: Selection = { selected: null, item: null };

const isDistrict = (id: string | undefined): id is DistrictId => Boolean(id && id in districtById);

/**
 * Routes under /city:
 *   /city                         the overview
 *   /city/:place                  a place, e.g. /city/nvidia
 *   /city/:place/:item            an object in a place, e.g. /city/studio/camera
 *   /city/work, /city/projects    index pages
 *   /city/work/:id, /city/projects/:id   case studies
 *   /city/about
 */
export function parseCityPath(pathname: string): CityRoute {
  const [first, second] = pathname.replace(/^\/city\/?/, '').split('/').filter(Boolean);

  if (first === 'work' || first === 'projects') {
    const study: CaseStudy | undefined = second ? caseStudyById[second] : undefined;
    if (study && study.section === first) {
      return { selection: { selected: study.place ?? null, item: study.item ?? null }, page: { kind: 'case', id: study.id } };
    }
    return { selection: null, page: { kind: first } };
  }
  if (first === 'about') return { selection: null, page: { kind: 'about' } };
  if (isDistrict(first)) {
    const item = second && itemById[second]?.district === first ? second : null;
    return { selection: { selected: first, item }, page: null };
  }
  return { selection: overview, page: null };
}

export function pathForSelection({ selected, item }: Selection) {
  if (!selected) return '/';
  return item ? `${CITY_BASE}/${selected}/${item}` : `${CITY_BASE}/${selected}`;
}

export function pathForCaseStudy(study: CaseStudy) {
  return `${CITY_BASE}/${study.section}/${study.id}`;
}
