import * as setIsoDay from 'date-fns/set_iso_day';
import * as findIndex from 'lodash/findIndex';
import { observer } from 'mobx-react';
import * as React from 'react';
import { MdHome, MdPlace } from 'react-icons/md';

import { dataStore, preferenceStore, uiState } from '../../store';
import { RestaurantType } from '../../store/types';
import * as api from '../../utils/api';
import MenuViewer from '../MenuViewer';
import PageContainer from '../PageContainer';
import Text from '../Text';
import Map from './Map';
import * as css from './RestaurantModal.scss';

function getOpeningHourString(hours: string[]) {
  return hours.reduce((open, hour, i) => {
    if (hour) {
      const existingIndex = findIndex(open, ['hour', hour]);
      if (existingIndex > -1) {
        open[existingIndex].endDay = i;
      } else {
        open.push({ startDay: i, hour });
      }
    }
    return open;
  }, []);
}

const OpeningHours = ({ openingHours }: { openingHours: string[] }) => (
  <div className={css.openingHoursContainer}>
    {getOpeningHourString(openingHours).map(hours => (
      <div key={hours.startDay} className={css.openingHours}>
        <span className={css.day}>
          <Text id="ddd" date={setIsoDay(new Date(), hours.startDay + 1)} />
          {hours.endDay && (
            <span>
              &nbsp;&ndash;&nbsp;
              <Text id="ddd" date={setIsoDay(new Date(), hours.endDay + 1)} />
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

const Meta = ({ restaurant }: { restaurant: RestaurantType }) => (
  <div className={css.meta}>
    <a
      href={`https://maps.google.com/?q=${encodeURIComponent(
        restaurant.address
      )}`}
      target="_blank"
    >
      <MdPlace className="inline-icon" />
      {restaurant.address}
    </a>
    <a href={restaurant.url} target="_blank">
      <MdHome className="inline-icon" />
      <Text id="homepage" />
    </a>
  </div>
);

interface Props {
  restaurantId: number;
}

export default observer(
  class RestaurantModal extends React.Component {
    props: Props;
    state: {
      restaurant: RestaurantType | null;
      notFound: boolean;
    } = {
      notFound: false,
      restaurant: null
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
        return <PageContainer title={<Text id="restaurantNotFound" />} />;
      }
      if (!restaurant) {
        return null;
      }
      return (
        <PageContainer title={restaurant.name}>
          <div className={css.info}>
            <Meta restaurant={restaurant} />
            <OpeningHours openingHours={restaurant.openingHours} />
          </div>
          <MenuViewer showCopyButton restaurantId={restaurant.id} />
          <Map
            restaurant={restaurant}
            restaurantPoint={[restaurant.latitude, restaurant.longitude]}
            userPoint={
              uiState.location
                ? [uiState.location.latitude, uiState.location.longitude]
                : undefined
            }
          />
        </PageContainer>
      );
    }
  }
);
