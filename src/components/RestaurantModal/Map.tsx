import leaflet from 'leaflet';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import 'leaflet/dist/leaflet.css';
import { breakSmall } from '../../globalStyles';
import { MapLockedIcon, MapUnlockedIcon } from '../../icons';

import type { RestaurantType } from '../../types';
import restaurantLocationIcon from './restaurant-location.png';
import userLocationIcon from './user-location.png';

const MapWrapper = styled.div`
  position: relative;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  min-height: 30rem;
  height: 30rem;
  margin: -1rem -1rem -1rem -1rem;
  overflow: hidden;
`;

const Container = styled.div`
  position: absolute;
  inset: 0;
`;

const MapOverlay = styled.div<{ locked: boolean }>`
  display: none;

  @media (max-width: ${breakSmall}) {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 500;
    pointer-events: ${props => (props.locked ? 'auto' : 'none')};
  }
`;

const LockButton = styled.button`
  display: none;

  @media (max-width: ${breakSmall}) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 24px;
    right: 24px;
    z-index: 501;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    color: var(--text-secondary);
    box-shadow: var(--shadow-md);
    cursor: pointer;
    transition: transform 0.1s;

    &:active {
      transform: scale(0.9);
    }
  }
`;

interface Props {
  restaurantPoint: [number, number];
  userPoint?: [number, number];
  restaurant: RestaurantType;
}

export default function RestaurantMap(props: Props) {
  let container: HTMLDivElement | undefined;
  let map: leaflet.Map;

  const [locked, setLocked] = createSignal(true);

  onMount(() => {
    map = leaflet.map(container!).setView(props.restaurantPoint, 14);
    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map);

    const restaurantMarker = leaflet
      .marker(props.restaurantPoint, {
        icon: leaflet.icon({
          iconUrl: restaurantLocationIcon,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      })
      .addTo(map);

    if (props.userPoint) {
      const userMarker = leaflet
        .marker(props.userPoint, {
          icon: leaflet.icon({
            iconUrl: userLocationIcon,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        })
        .addTo(map);
      map.fitBounds(
        leaflet.featureGroup([restaurantMarker, userMarker]).getBounds(),
      );
    }
  });

  onCleanup(() => {
    map.remove();
  });

  return (
    <MapWrapper>
      <Container ref={container} />
      <MapOverlay locked={locked()} />
      <LockButton type="button" onClick={() => setLocked(v => !v)}>
        {locked() ? <MapLockedIcon size={18} /> : <MapUnlockedIcon size={18} />}
      </LockButton>
    </MapWrapper>
  );
}
