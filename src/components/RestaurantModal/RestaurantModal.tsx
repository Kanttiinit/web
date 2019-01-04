import * as setIsoDay from 'date-fns/set_iso_day';
import * as findIndex from 'lodash/findIndex';
import { observer } from 'mobx-react';
import * as React from 'react';
import { MdHome, MdPlace } from 'react-icons/md';
import styled from 'styled-components';

import { dataStore, preferenceStore, uiState } from '../../store';
import { RestaurantType } from '../../store/types';
import * as api from '../../utils/api';
import InlineIcon from '../InlineIcon';
import MenuViewer from '../MenuViewer';
import PageContainer from '../PageContainer';
import Text from '../Text';
import Map from './Map';

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

const Info = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: var(--gray2);
  font-size: 0.8rem;
  line-height: 1.5em;

  @media (max-width: ${props => props.theme.breakSmall}) {
    font-size: 0.7em;
    align-items: flex-start;
  }
`;

const MetaLink = styled.a`
  text-transform: uppercase;
  display: block;

  &:hover {
    opacity: 0.8;
  }
`;

const OpeningHoursContainer = styled.div`
  display: table;
  position: relative;
  z-index: 1;
`;

const OpeningHoursRow = styled.div`
  display: table-row;
`;

const OpeningHoursDay = styled.div`
  display: table-cell;
  text-transform: uppercase;
  opacity: 0.6;
  text-align: right;
`;

const OpeningHoursTime = styled.div`
  display: table-cell;
  padding-left: 0.4em;
`;

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
          <Info>
            <div>
              <MetaLink
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  restaurant.address
                )}`}
                target="_blank"
              >
                <InlineIcon>
                  <MdPlace />
                </InlineIcon>
                {restaurant.address}
              </MetaLink>
              <MetaLink href={restaurant.url} target="_blank">
                <InlineIcon>
                  <MdHome />
                </InlineIcon>
                <Text id="homepage" />
              </MetaLink>
            </div>
            <OpeningHoursContainer>
              {getOpeningHourString(restaurant.openingHours).map(hours => (
                <OpeningHoursRow key={hours.startDay}>
                  <OpeningHoursDay>
                    <Text
                      id="ddd"
                      date={setIsoDay(new Date(), hours.startDay + 1)}
                    />
                    {hours.endDay && (
                      <span>
                        &nbsp;&ndash;&nbsp;
                        <Text
                          id="ddd"
                          date={setIsoDay(new Date(), hours.endDay + 1)}
                        />
                      </span>
                    )}
                  </OpeningHoursDay>
                  <OpeningHoursTime>
                    {hours.hour.replace('-', '–') || <Text id="closed" />}
                  </OpeningHoursTime>
                </OpeningHoursRow>
              ))}
            </OpeningHoursContainer>
          </Info>
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
