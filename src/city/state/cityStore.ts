import { useSyncExternalStore } from 'react';
import type { DistrictId } from '../data/districts';
import { itemById } from '../data/items';

/** 'auto' follows the visitor's local time. */
export type TimeMode = 'auto' | 'day' | 'evening' | 'night';

export interface CityState {
  /** True once the intro has finished and the world accepts input. */
  ready: boolean;
  hovered: DistrictId | null;
  selected: DistrictId | null;
  /** An item open inside the selected district, such as a project in the lab. */
  item: string | null;
  hoveredItem: string | null;
  timeMode: TimeMode;
  /** Revealed by the /dumpster command. */
  dumpster: boolean;
}

const TIME_KEY = 'city:time-mode';

function storedTimeMode(): TimeMode {
  try {
    const value = window.localStorage.getItem(TIME_KEY);
    return value === 'day' || value === 'evening' || value === 'night' ? value : 'auto';
  } catch {
    return 'auto';
  }
}

const initialState: CityState = {
  ready: false,
  hovered: null,
  selected: null,
  item: null,
  hoveredItem: null,
  timeMode: 'auto',
  dumpster: false,
};

let state: CityState = { ...initialState, timeMode: storedTimeMode() };

const listeners = new Set<() => void>();

function set(patch: Partial<CityState>) {
  const next = { ...state, ...patch };
  const changed = (Object.keys(patch) as (keyof CityState)[]).some((key) => state[key] !== next[key]);
  if (!changed) return;
  state = next;
  listeners.forEach((listener) => listener());
}

/**
 * Selection state shared by the 3D world and the DOM overlay, so hovering or
 * choosing a place works the same from a building, the index, or the keyboard.
 */
export const cityStore = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  reset() {
    set({ ...initialState, timeMode: state.timeMode });
  },
  setReady(ready: boolean) {
    set({ ready });
  },
  hover(id: DistrictId) {
    if (state.ready) set({ hovered: id });
  },
  unhover(id: DistrictId) {
    if (state.hovered === id) set({ hovered: null });
  },
  select(id: DistrictId) {
    if (state.ready) set({ selected: id, item: null, hovered: null, hoveredItem: null });
  },
  hoverItem(id: string) {
    if (state.ready) set({ hoveredItem: id });
  },
  unhoverItem(id: string) {
    if (state.hoveredItem === id) set({ hoveredItem: null });
  },
  selectItem(id: string) {
    if (state.ready) set({ selected: itemById[id].district, item: id, hovered: null, hoveredItem: null });
  },
  /** Apply a selection from the URL, even before the world is ready for input. */
  restore({ selected, item }: { selected: DistrictId | null; item: string | null }) {
    set({ selected, item, hovered: null, hoveredItem: null });
  },
  /** Step back one level: from an item to its district, or from a district to the city. */
  back() {
    if (state.item) set({ item: null });
    else set({ selected: null, hoveredItem: null });
  },
  clear() {
    set({ selected: null, item: null, hoveredItem: null });
  },
  setTimeMode(timeMode: TimeMode) {
    set({ timeMode });
    try {
      window.localStorage.setItem(TIME_KEY, timeMode);
    } catch {
      // Private windows and blocked storage: the choice just won't be remembered.
    }
  },
  revealDumpster() {
    set({ dumpster: true });
  },
};

export function useCity<T>(selector: (state: CityState) => T): T {
  return useSyncExternalStore(cityStore.subscribe, () => selector(state));
}
