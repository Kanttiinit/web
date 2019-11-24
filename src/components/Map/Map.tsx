import PigeonMap from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { RestaurantType, AreaType } from '../../contexts/types';
import http from '../../utils/http';
import useResource from '../../utils/useResource';
import Tooltip from '../Tooltip';
import RestaurantInfoSheet from './RestaurantInfoSheet';
import { preferenceContext } from '../../contexts';
import { number } from 'prop-types';

const DEFAULT_CENTER = [60.1680363, 24.9317823];

function getCenter(activeRestaurant: RestaurantType, activeArea: AreaType) {
  // return DEFAULT_CENTER;
  const areaHasRestaurant =
    !activeRestaurant ||
    ((activeArea && activeArea.restaurants) || [])
      .map(r => r.id)
      .includes(activeRestaurant.id);

  // active restaurant > selected area center

  return activeRestaurant
    ? [activeRestaurant.latitude, activeRestaurant.longitude]
    : activeArea
    ? [activeArea.latitude, activeArea.longitude]
    : DEFAULT_CENTER;
}

function getDelay(restaurant: RestaurantType): number {
  return (restaurant.longitude - 24.805201) * 2;
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

interface PinProps {
  delay: number;
  active: boolean;
}

const Pin = styled.div`
  width: 13px;
  height: 13px;
  background-color: ${(props: PinProps) =>
    props.active ? '#23c0ff' : '#2196f3'};
  border-radius: 50%;
  border: solid 1px white;
  cursor: pointer;
  @keyframes slide-in-top {
    0% {
      transform: translateY(-300px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  animation: slide-in-top 0.4s ease-out 0.1s both;
  animation-delay: ${(props: PinProps) => props.delay + 's'};
`;

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Map = () => {
  const [areas, setAreas] = useResource<AreaType[]>([]);
  const [restaurants, setRestaurants] = useResource<RestaurantType[]>([]);

  React.useEffect(() => {
    setAreas(http.get('/areas'));
  }, []);

  React.useEffect(() => {
    setRestaurants(http.get('/restaurants'));
  }, []);

  const [activeRestaurant, setActiveRestaurant] = React.useState<
    RestaurantType
  >(null);
  const handleClose = () => setActiveRestaurant(null);

  const { selectedArea } = React.useContext(preferenceContext);
  const activeArea = (areas.data || []).find(area => area.id === selectedArea);
  const center = getCenter(activeRestaurant, activeArea);

  return (
    <Container>
      <PigeonMap defaultZoom={12} center={center}>
        {restaurants.data.map(restaurant => (
          <Overlay
            key={restaurant.id}
            offset={[6, 6]}
            anchor={[restaurant.latitude, restaurant.longitude]}
          >
            <Tooltip text={restaurant.name}>
              <Pin
                active={activeRestaurant && activeRestaurant.id === restaurant.id}
                onClick={() => setActiveRestaurant(restaurant)}
                delay={getDelay(restaurant)}
              />
            </Tooltip>
          </Overlay>
        ))}
      </PigeonMap>
      <Global />
      {!!activeRestaurant && (
        <RestaurantInfoSheet
          restaurantData={activeRestaurant}
          onClose={handleClose}
        />
      )}
    </Container>
  );
};

export default Map;
