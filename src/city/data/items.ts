import type { DistrictId } from './districts';
import { projects } from './projects';
import { studioObjects } from './studio';

/** Anything inside a district that can be opened on its own: a project, or an object in the studio. */
export interface WorldItem {
  id: string;
  district: DistrictId;
  name: string;
  kicker: string;
  summary: string;
  points?: string[];
  tags?: string;
}

export const items: WorldItem[] = [
  ...projects.map((project) => ({ ...project, district: 'lab' as const })),
  ...studioObjects.map((object) => ({ ...object, district: 'studio' as const })),
];

export const itemById = Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, WorldItem>;

export const itemsIn = (district: DistrictId) => items.filter((item) => item.district === district);

/** The item before or after this one in the same district, wrapping around. */
export function neighbourItem(id: string, step: 1 | -1): WorldItem {
  const siblings = itemsIn(itemById[id].district);
  const i = siblings.findIndex((item) => item.id === id);
  return siblings[(i + step + siblings.length) % siblings.length];
}
