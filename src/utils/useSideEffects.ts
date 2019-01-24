import * as addDays from 'date-fns/add_days';
import * as isSameDay from 'date-fns/is_same_day';
import { useContext, useEffect, useState } from 'react';
import * as GA from 'react-ga';

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

  // update restaurants
  useEffect(() => {
    if (selectedArea) {
      data.markMenusPending();
      data.setRestaurants(
        api.getRestaurantsByIds(selectedArea.restaurants, lang)
      );
    }
  }, [selectedArea, lang]);

  useEffect(() => {
    if (preferences.selectedArea === -1) {
      if (preferences.starredRestaurants.length) {
        data.markMenusPending();
        data.setRestaurants(
          api.getRestaurantsByIds(preferences.starredRestaurants, lang)
        );
      } else {
        data.setRestaurants(Promise.resolve([]));
      }
    }
  }, [preferences.selectedArea, preferences.starredRestaurants, lang]);

  useEffect(() => {
    if (preferences.selectedArea === -2) {
      if (ui.location) {
        const { latitude, longitude } = ui.location;
        data.markMenusPending();
        data.setRestaurants(
          api.getRestaurantsByLocation(latitude, longitude, lang)
        );
      } else {
        data.setRestaurants(Promise.resolve([]));
      }
    }
  }, [preferences.selectedArea, preferences.starredRestaurants, ui.location]);

  // update menus
  useEffect(() => {
    if (data.restaurants.fulfilled) {
      const restaurantIds = data.restaurants.data.map(
        restaurant => restaurant.id
      );
      const menus = api.getMenus(restaurantIds, [ui.selectedDay], lang);
      data.setMenus(menus);
    }
  }, [data.restaurants.data, ui.selectedDay, lang]);

  // update location
  const [locationWatchId, setLocationWatchId] = useState(null);
  useEffect(() => {
    // start or stop watching for location
    if (preferences.useLocation && !locationWatchId) {
      setLocationWatchId(
        navigator.geolocation.watchPosition(
          ({ coords }) => {
            ui.setLocation(coords);
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
        const response = await fetch(`/check-update?version=${version}`);
        const json = await response.json();
        if (json.updateAvailable) {
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
};
