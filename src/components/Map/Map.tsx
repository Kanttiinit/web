import * as React from 'react';
import PigeonMap from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import styled, { createGlobalStyle } from 'styled-components';

import http from '../../utils/http';

import Tooltip from '../Tooltip';
import { RestaurantType } from '../../store/types';

type State = {
  restaurants: Array<RestaurantType>;
};

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
`;

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

export default class Map extends React.PureComponent<void, State> {
  state: State = {
    restaurants: []
  };

  loadRestaurants = async () => {
    const restaurants = await http.get('/restaurants');
    this.setState({ restaurants });
  };

  componentDidMount() {
    this.loadRestaurants();
  }

  render() {
    return (
      <Container>
        <PigeonMap defaultZoom={14} defaultCenter={[60.1680363, 24.9317823]}>
          {this.state.restaurants.map(restaurant => (
            <Overlay
              key={restaurant.id}
              offset={[6, 6]}
              anchor={[restaurant.latitude, restaurant.longitude]}
            >
              <Tooltip text={restaurant.name}>
                <Pin />
              </Tooltip>
            </Overlay>
          ))}
        </PigeonMap>
        <Global />
      </Container>
    );
  }
}
