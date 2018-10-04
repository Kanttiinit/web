import * as React from 'react';
import PigeonMap from 'pigeon-maps';
import Overlay from 'pigeon-overlay';

import http from '../../utils/http';

import * as styles from './Map.scss';
import Tooltip from '../Tooltip';
import { RestaurantType } from '../../store/types';

type State = {
  restaurants: Array<RestaurantType>;
};

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
      <div className={styles.container}>
        <PigeonMap defaultZoom={14} defaultCenter={[60.1680363, 24.9317823]}>
          {this.state.restaurants.map(restaurant => (
            <Overlay
              key={restaurant.id}
              offset={[6, 6]}
              anchor={[restaurant.latitude, restaurant.longitude]}
            >
              <Tooltip text={restaurant.name}>
                <div className={styles.pin} />
              </Tooltip>
            </Overlay>
          ))}
        </PigeonMap>
      </div>
    );
  }
}
