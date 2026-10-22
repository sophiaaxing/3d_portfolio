import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseCityPath, pathForSelection } from '../routing';
import { cityStore } from '../state/cityStore';

/**
 * Keeps the URL and the city's selection in step, in both directions:
 * opening /city/nvidia flies to NVIDIA, and clicking NVIDIA in the world
 * changes the URL, so reloads, shared links, and the back button all work.
 */
export function useCityRouting() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = useMemo(() => parseCityPath(location.pathname), [location.pathname]);

  // URL → world.
  useEffect(() => {
    if (route.selection) cityStore.restore(route.selection);
  }, [route]);

  // World → URL. Pages own the URL while they are open.
  useEffect(
    () =>
      cityStore.subscribe(() => {
        if (parseCityPath(window.location.pathname).page) return;
        const path = pathForSelection(cityStore.get());
        if (path !== window.location.pathname) navigate(path);
      }),
    [navigate],
  );

  return route;
}
