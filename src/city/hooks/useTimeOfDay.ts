import { useEffect, useState } from 'react';
import { useCity } from '../state/cityStore';

export type TimePhase = 'day' | 'evening' | 'night';

/** From the visitor's clock: evening around sunrise and sunset, night after dark. */
export function phaseForTime(date: Date): TimePhase {
  const hour = date.getHours() + date.getMinutes() / 60;
  if (hour >= 20 || hour < 6) return 'night';
  if (hour >= 17 || hour < 7.5) return 'evening';
  return 'day';
}

/** The time of day the world shows: the visitor's own, unless they have picked one. */
export function useTimeOfDay(): TimePhase {
  const mode = useCity((s) => s.timeMode);
  const [local, setLocal] = useState(() => phaseForTime(new Date()));

  useEffect(() => {
    if (mode !== 'auto') return;
    setLocal(phaseForTime(new Date()));
    const timer = window.setInterval(() => setLocal(phaseForTime(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, [mode]);

  return mode === 'auto' ? local : mode;
}
