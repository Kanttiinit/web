import { autorun } from 'mobx';
import DataStore from './DataStore';
import PreferenceStore from './PreferenceStore';
import UIState from './UIState';
import * as api from '../utils/api';

export const preferenceStore = new PreferenceStore();
export const uiState = new UIState();
export const dataStore = new DataStore(preferenceStore, uiState);

const updateAreasAndFavorites = () => {
  const lang = preferenceStore.lang;
  dataStore.areas.fetch(api.getAreas(lang));
  dataStore.favorites.fetch(api.getFavorites(lang));
};

const updateRestaurants = () => {
  const lang = preferenceStore.lang;
  let promise;
  if (lang && dataStore.selectedArea) {
    promise = api.getRestaurantsByIds(dataStore.selectedArea.restaurants, lang);
  } else if (preferenceStore.selectedArea < 0) {
    if (
      preferenceStore.selectedArea === -1 &&
      preferenceStore.starredRestaurants.length
    ) {
      promise = api.getRestaurantsByIds(
        preferenceStore.starredRestaurants,
        lang
      );
    } else if (preferenceStore.selectedArea === -2 && uiState.location) {
      const { latitude, longitude } = uiState.location;
      promise = api.getRestaurantsByLocation(latitude, longitude, lang);
    }
  }

  if (promise) {
    dataStore.restaurants.fetch(promise);
  }
};

const updateMenus = () => {
  if (dataStore.restaurants.fulfilled) {
    const restaurantIds = dataStore.restaurants.data.map(
      restaurant => restaurant.id
    );
    const menus = api.getMenus(
      restaurantIds,
      [uiState.selectedDay],
      preferenceStore.lang
    );
    dataStore.menus.fetch(menus);
  }
};

let locationWatchId;
autorun(() => {
  // start or stop watching for location
  if (preferenceStore.useLocation && !locationWatchId) {
    locationWatchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        uiState.setLocation(coords);
      },
      error => {
        switch (error.code) {
          case 1:
            preferenceStore.useLocation = false;
        }
      }
    );
  } else if (!preferenceStore.useLocation && locationWatchId) {
    navigator.geolocation.clearWatch(locationWatchId);
    locationWatchId = null;
    uiState.location = null;
  }
});

autorun(updateAreasAndFavorites);

autorun(updateRestaurants);

autorun(updateMenus);
