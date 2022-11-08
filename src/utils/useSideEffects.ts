import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import * as haversine from 'haversine';
import { useContext, useEffect, useState } from 'react';
import * as GA from 'react-ga';
import * as semver from 'semver';

import {
  dataContext,
  langContext,
  preferenceContext,
  uiContext
} from '../contexts';
import { getNewPath, isDateInRange } from '../contexts/uiContext';
import * as api from '../utils/api';
import { isProduction, version } from './consts';
import { useSelectedArea } from './hooks';

GA.initialize('UA-85003235-1', {
  debug: !isProduction
});

function pageView(location: Location) {
  const pathname = location.pathname + location.search;
  GA.set({ page: pathname, 'App Version': version });
  GA.pageview(pathname);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (location: any, history: any) => {
  const { lang } = useContext(langContext);
  const preferences = useContext(preferenceContext);
  const ui = useContext(uiContext);
  const data = useContext(dataContext);
  const selectedArea = useSelectedArea();

  // update areas and restaurants
  useEffect(() => {
    data.setAreas(api.getAreas(lang));
    data.setFavorites(api.getFavorites(lang));
  }, [lang]);
  
  // update location
  const [locationWatchId, setLocationWatchId] = useState(null);
  useEffect(() => {
    // start or stop watching for location
    if (preferences.useLocation && !locationWatchId) {
      setLocationWatchId(
        navigator.geolocation.watchPosition(
          ({ coords }) => {
            ui.setLocation(currentLocation => {
              if (!currentLocation) {
                return coords;
              }
              const distance = haversine(currentLocation, coords, {
                unit: 'meter'
              });
              if (distance > 100) {
                return coords;
              }
              return currentLocation;
            });
          },
          error => {
            switch (error.code) {
              case 1:
                preferences.setUseLocation(false);
            }
          }
        )
      );
    } else if (!preferences.useLocation && locationWatchId) {
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
      ui.setLocation(null);
    }
  }, [preferences.useLocation]);

  // updates states on focus
  useEffect(() => {
    let lastUpdateCheck = Math.round(Date.now() / 1000);

    const update = async () => {
      // check for newer version and reload
      const now = Math.round(Date.now() / 1000);
      if (!lastUpdateCheck || now - lastUpdateCheck > 3600) {
        lastUpdateCheck = now;
        const response = await fetch('/version.txt');
        const latestVersion = await response.text();
        if (semver.gt(latestVersion, version)) {
          window.location.reload();
        }
      }

      // update displayed days if first day is in past
      if (
        ui.displayedDays.length &&
        !isSameDay(new Date(), ui.displayedDays[0])
      ) {
        ui.updateDisplayedDays();
      }

      ui.updateDay(window.location);
    };

    window.addEventListener('focus', update);

    return () => window.removeEventListener('focus', update);
  }, []);

  // initialize stuff
  useEffect(() => {
    data.setUpdates(api.getUpdates());
  }, []);

  // listen to left and right keys
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName !== 'INPUT') {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const offset = e.key === 'ArrowLeft' ? -1 : 1;
          const newDay = addDays(ui.selectedDay, offset);
          if (isDateInRange(newDay)) {
            history.replace(getNewPath(newDay));
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ui.selectedDay]);

  useEffect(() => {
    ui.updateDay(window.location);
    data.markMenusPending();
  }, [location.search]);

  useEffect(() => {
    pageView(location);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (selectedArea) {
      GA.event({
        action: 'selected area',
        category: 'User',
        label: selectedArea.name,
        value: selectedArea.id
      });
    }
  }, [selectedArea]);
};
