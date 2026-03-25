import { useNavigate } from '@solidjs/router';
import { getISODay as getIsoDay } from 'date-fns';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  createEffect,
  createResource,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { styled } from 'solid-styled-components';
import * as api from '../../api';
import { breakSmall } from '../../globalStyles';
import { CloseIcon, LoaderIcon } from '../../icons';
import { computedState, resources, state } from '../../state';
import type { AreaType, RestaurantType } from '../../types';
import { bufferPolygon, convexHull, smoothPolygon } from './convexHull';
import AreaPills from './AreaPills';
import RestaurantBottomSheet from './RestaurantBottomSheet';

import restaurantLocationIcon from '../RestaurantModal/restaurant-location.png';

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 11;
  background: var(--bg-app);
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const TopOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background: linear-gradient(to bottom, var(--bg-app) 0%, transparent 100%);
  padding-top: env(safe-area-inset-top, 0);
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem 0 0.5rem;
  gap: 0.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  flex-shrink: 0;
  z-index: 501;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.9);
  }
`;

const SpinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 499;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-app);
  color: var(--text-disabled);

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  svg {
    animation: spin 0.9s linear infinite;
  }
`;

const AREA_COLORS = [
  '#09ACFE', '#06CBB0', '#F2A65A', '#fe346e',
  '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444',
  '#14b8a6', '#ec4899', '#6366f1', '#84cc16',
];

function getTodayHours(restaurant: RestaurantType): string {
  const dayIndex = getIsoDay(new Date()) - 1;
  const hours = restaurant.openingHours[dayIndex];
  return hours ? hours.replace('-', '\u2013') : '';
}

export default function MapView() {
  const navigate = useNavigate();
  let mapContainer: HTMLDivElement | undefined;
  let map: leaflet.Map;

  const [selectedAreaId, setSelectedAreaId] = createSignal<number | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = createSignal<RestaurantType | null>(null);

  const [areas] = resources.areas;

  // Fetch all restaurants for all areas in one batch
  const [allRestaurants] = createResource(
    () => {
      const areaData = areas();
      if (!areaData) return null;
      return { areas: areaData, lang: state.preferences.lang };
    },
    async source => {
      if (!source) return new Map<number, RestaurantType[]>();
      const allIds = new Set<number>();
      for (const area of source.areas) {
        for (const id of area.restaurants) {
          allIds.add(id);
        }
      }
      if (allIds.size === 0) return new Map<number, RestaurantType[]>();

      const restaurants = await api.getRestaurantsByIds(
        [...allIds],
        source.lang,
      );

      const restaurantMap = new Map<number, RestaurantType>();
      for (const r of restaurants) {
        restaurantMap.set(r.id, r);
      }

      const grouped = new Map<number, RestaurantType[]>();
      for (const area of source.areas) {
        const areaRestaurants: RestaurantType[] = [];
        for (const id of area.restaurants) {
          const r = restaurantMap.get(id);
          if (r) areaRestaurants.push(r);
        }
        grouped.set(area.id, areaRestaurants);
      }
      return grouped;
    },
  );

  const markerIcon = leaflet.icon({
    iconUrl: restaurantLocationIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Leaflet layer groups for easy clearing
  let polygonGroup: leaflet.LayerGroup;
  let markerGroup: leaflet.LayerGroup;

  onMount(() => {
    map = leaflet.map(mapContainer!, {
      zoomControl: false,
    }).setView([60.17, 24.94], 12);

    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map);

    leaflet.control.zoom({ position: 'bottomleft' }).addTo(map);

    polygonGroup = leaflet.layerGroup().addTo(map);
    markerGroup = leaflet.layerGroup().addTo(map);

    // Handle popup expand button clicks
    map.on('popupopen', (e: leaflet.LeafletEvent) => {
      const popup = (e as any).popup as leaflet.Popup;
      const container = popup.getElement();
      if (!container) return;
      const expandButton = container.querySelector('.expand-btn');
      if (expandButton) {
        expandButton.addEventListener('click', () => {
          const restaurantId = Number(expandButton.getAttribute('data-id'));
          const data = allRestaurants();
          if (!data) return;
          for (const restaurants of data.values()) {
            const found = restaurants.find(r => r.id === restaurantId);
            if (found) {
              map.closePopup();
              setSelectedRestaurant(found);
              return;
            }
          }
        });
      }
    });
  });

  onCleanup(() => {
    if (map) map.remove();
  });

  function renderOverview(areasData: AreaType[], restaurantsByArea: Map<number, RestaurantType[]>) {
    polygonGroup.clearLayers();
    markerGroup.clearLayers();

    const allBounds: leaflet.LatLngBounds[] = [];

    areasData.forEach((area, index) => {
      const restaurants = restaurantsByArea.get(area.id) || [];
      const points = restaurants
        .filter(r => r.latitude && r.longitude)
        .map(r => [r.latitude, r.longitude] as [number, number]);

      if (points.length === 0) return;

      const color = AREA_COLORS[index % AREA_COLORS.length];

      if (points.length < 3) {
        // Fall back to circle markers for areas with too few restaurants
        for (const p of points) {
          leaflet.circleMarker(p, {
            radius: 20,
            color,
            fillColor: color,
            fillOpacity: 0.25,
            weight: 2,
          }).bindTooltip(area.name, { permanent: false }).addTo(polygonGroup);
        }
        allBounds.push(leaflet.latLngBounds(points.map(p => leaflet.latLng(p[0], p[1]))));
        return;
      }

      const hull = convexHull(points);
      const buffered = bufferPolygon(hull, 250);
      const smoothed = smoothPolygon(buffered, 3);

      const polygon = leaflet.polygon(smoothed, {
        color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(polygonGroup);

      polygon.bindTooltip(area.name, {
        permanent: false,
        direction: 'center',
        className: 'area-tooltip',
      });

      polygon.on('click', () => {
        setSelectedAreaId(area.id);
      });

      allBounds.push(polygon.getBounds());
    });

    if (allBounds.length > 0) {
      let combinedBounds = allBounds[0];
      for (let i = 1; i < allBounds.length; i++) {
        combinedBounds = combinedBounds.extend(allBounds[i]);
      }
      map.flyToBounds(combinedBounds, { padding: [40, 40], duration: 0.8 });
    }
  }

  function renderArea(areaId: number, restaurantsByArea: Map<number, RestaurantType[]>) {
    polygonGroup.clearLayers();
    markerGroup.clearLayers();

    const restaurants = restaurantsByArea.get(areaId) || [];
    const validRestaurants = restaurants.filter(r => r.latitude && r.longitude);

    if (validRestaurants.length === 0) return;

    const closedText = computedState.translations().closed;

    for (const restaurant of validRestaurants) {
      const todayHours = getTodayHours(restaurant);
      const hoursDisplay = todayHours || closedText;

      const popupHtml = `
        <div style="min-width: 160px; font-family: 'Interface', sans-serif;">
          <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">${escapeHtml(restaurant.name)}</div>
          <div style="font-size: 0.78rem; color: #636363; margin-bottom: 8px;">${escapeHtml(hoursDisplay)}</div>
          <button class="expand-btn" data-id="${restaurant.id}" style="
            display: flex; align-items: center; gap: 4px;
            background: var(--accent_color, #09ACFE); color: #fff;
            border: none; border-radius: 6px; padding: 5px 10px;
            font-size: 0.75rem; font-weight: 500; cursor: pointer;
            width: 100%;
            justify-content: center;
          ">
            ${computedState.translations().menuTab}
          </button>
        </div>
      `;

      leaflet.marker([restaurant.latitude, restaurant.longitude], {
        icon: markerIcon,
      })
        .bindPopup(popupHtml, { closeButton: false, minWidth: 160 })
        .addTo(markerGroup);
    }

    const bounds = leaflet.latLngBounds(
      validRestaurants.map(r => leaflet.latLng(r.latitude, r.longitude)),
    );
    map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8 });
  }

  // React to data + selection changes
  createEffect(
    on(
      () => ({ areaId: selectedAreaId(), data: allRestaurants(), areasData: areas() }),
      ({ areaId, data, areasData }) => {
        if (!data || !areasData || !map) return;

        if (areaId === null) {
          renderOverview(areasData, data);
        } else {
          renderArea(areaId, data);
        }
      },
    ),
  );

  return (
    <Wrapper>
      <MapContainer ref={mapContainer} />

      <Show when={allRestaurants.loading}>
        <SpinnerOverlay>
          <LoaderIcon size={32} />
        </SpinnerOverlay>
      </Show>

      <TopOverlay>
        <TopRow>
          <BackButton onClick={() => navigate('/')}>
            <CloseIcon size={18} />
          </BackButton>
        </TopRow>
        <Show when={areas()}>
          {areasData => (
            <AreaPills
              areas={areasData()}
              selectedAreaId={selectedAreaId()}
              onSelect={setSelectedAreaId}
            />
          )}
        </Show>
      </TopOverlay>

      <RestaurantBottomSheet
        restaurant={selectedRestaurant()}
        onClose={() => setSelectedRestaurant(null)}
      />
    </Wrapper>
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
