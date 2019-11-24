import PigeonMap from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { RestaurantType } from '../../contexts/types';
import http from '../../utils/http';
import useResource from '../../utils/useResource';
import Tooltip from '../Tooltip';
import RestaurantInfoSheet from './RestaurantInfoSheet';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Pin = styled.div`
  width: 13px;
  height: 13px;
  background: #2196f3;
  border-radius: 50%;
  border: solid 1px white;
  cursor: pointer;
`;

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Map = () => {
  const [restaurants, setRestaurants] = useResource<RestaurantType[]>([]);

  React.useEffect(() => {
    setRestaurants(http.get('/restaurants'));
  }, []);

  const [activeRestaurant, setActiveRestaurant] = React.useState<
    RestaurantType
  >(null);
  const handleClose = () => setActiveRestaurant(null);

  return (
    <Container>
      <PigeonMap defaultZoom={14} defaultCenter={[60.1680363, 24.9317823]}>
        {restaurants.data.map(restaurant => (
          <Overlay
            key={restaurant.id}
            offset={[6, 6]}
            anchor={[restaurant.latitude, restaurant.longitude]}
          >
            <Tooltip text={restaurant.name}>
              <Pin onClick={() => setActiveRestaurant(restaurant)} />
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
