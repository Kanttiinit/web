import * as React from 'react';
import * as moment from 'moment';
import * as Pin from 'react-icons/lib/md/place';
import * as Home from 'react-icons/lib/md/home';
import * as findIndex from 'lodash/findIndex';
import { observer } from 'mobx-react';

import Map from './GoogleMap';
import * as api from '../../utils/api';
import { dataStore, uiState, preferenceStore } from '../../store';
import PageContainer from '../PageContainer';
import { RestaurantType } from '../../store/types';
import MenuViewer from '../MenuViewer';
import * as css from './RestaurantModal.scss';
import Text from '../Text';

function getOpeningHourString(hours) {
  return hours.reduce((open, hour, i) => {
    if (hour) {
      const existingIndex = findIndex(open, ['hour', hour]);
      if (existingIndex > -1) open[existingIndex].endDay = i;
      else open.push({ startDay: i, hour });
    }
    return open;
  }, []);
}

const OpeningHours = ({ openingHours }) => (
  <div className={css.openingHoursContainer}>
    {getOpeningHourString(openingHours).map(hours => (
      <div key={hours.startDay} className={css.openingHours}>
        <span className={css.day}>
          <Text id="ddd" moment={moment().isoWeekday(hours.startDay + 1)} />
          {hours.endDay && (
            <span>
              &nbsp;&ndash;&nbsp;
              <Text id="ddd" moment={moment().isoWeekday(hours.endDay + 1)} />
            </span>
          )}
        </span>
        <span className={css.hours}>
          {hours.hour.replace('-', '–') || <Text id="closed" />}
        </span>
      </div>
    ))}
  </div>
);

const Meta = ({ restaurant }) => (
  <div className={css.meta}>
    <a
      href={`https://maps.google.com/?q=${encodeURIComponent(
        restaurant.address
      )}`}
      target="_blank"
    >
      <Pin className="inline-icon" />
      {restaurant.address}
    </a>
    <a href={restaurant.url} target="_blank">
      <Home className="inline-icon" />
      <Text id="homepage" />
    </a>
  </div>
);

type Props = {
  restaurantId: number;
};

@observer
export default class RestaurantModal extends React.Component {
  props: Props;
  state: {
    restaurant: RestaurantType | null;
    notFound: boolean;
  } = {
    restaurant: null,
    notFound: false
  };

  async fetchRestaurant(restaurantId: number) {
    let restaurant = dataStore.restaurants.data.find(
      r => r.id === Number(restaurantId)
    );
    if (!restaurant) {
      const result = await api.getRestaurantsByIds(
        [restaurantId],
        preferenceStore.lang
      );
      if (result.length) {
        restaurant = result[0];
      } else {
        this.setState({ notFound: true });
      }
    }
    this.setState({ restaurant });
  }

  componentDidUpdate(props: Props) {
    if (props.restaurantId !== this.props.restaurantId) {
      this.fetchRestaurant(props.restaurantId);
    }
  }

  componentDidMount() {
    this.fetchRestaurant(this.props.restaurantId);
  }

  render() {
    const { restaurant, notFound } = this.state;
    if (notFound) {
      return <p>Ravintolaa ei löytynyt!</p>;
    }
    if (!restaurant) {
      return null;
    }
    const restaurantPoint = {
      lat: restaurant.latitude,
      lng: restaurant.longitude
    };
    const userPoint = uiState.location
      ? {
        lat: uiState.location.latitude,
        lng: uiState.location.longitude
      }
      : undefined;
    return (
      <PageContainer title={restaurant.name}>
        <div className={css.info}>
          <Meta restaurant={restaurant} />
          <OpeningHours openingHours={restaurant.openingHours} />
        </div>
        <MenuViewer showCopyButton restaurantId={restaurant.id} />
        <Map
          containerElement={<div className={css.mapContainer} />}
          mapElement={<div className={css.map} />}
          restaurant={restaurant}
          restaurantPoint={restaurantPoint}
          userPoint={userPoint}
        />
      </PageContainer>
    );
  }
}
