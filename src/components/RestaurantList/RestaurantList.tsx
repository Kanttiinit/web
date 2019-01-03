import * as React from 'react';
import { observer } from 'mobx-react';
import { MdError } from 'react-icons/md';
import * as times from 'lodash/times';
const locating = require('../../assets/locating.svg');

import { dataStore, uiState, preferenceStore } from '../../store';
import Text from '../Text';
import NetworkStatus from '../NetworkStatus';
import Restaurant, { Placeholder } from '../Restaurant';
import styled from 'styled-components';

const Container = styled.div`
  padding: 4rem 0 1.5rem;

  @media (max-width: ${props => props.theme.breakSmall}) {
    padding-top: 3.5rem;
  }

  @media (min-width: ${props => props.theme.breakLarge}) {
    max-width: 95em;
    margin: 0 auto;
  }
`;

const ListContainer = styled.div`
  display: flex;

  @media (max-width: ${props => props.theme.breakSmall}) {
    max-width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  @media (min-width: ${props => props.theme.breakLarge}) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Locating = styled.div`
  text-align: center;
  flex: 1;

  img {
    max-width: 15rem;
  }
`;

const EmptyTextContainer = styled.div`
  font-weight: 500;
  text-transform: uppercase;
  color: var(--gray3);
  margin: 2em 0 0;
  text-align: center;
`;

export default observer(
  class RestaurantList extends React.Component {
    renderContent() {
      const loading =
        dataStore.menus.pending ||
        dataStore.restaurants.pending ||
        dataStore.areas.pending;
      const restaurants = dataStore.formattedRestaurants;
      if (loading) {
        return times(8, (i: number) => <Placeholder key={i} />);
      } else if (preferenceStore.selectedArea === -2) {
        if (!preferenceStore.useLocation) {
          return <Text id="turnOnLocation" element="p" className="notice" />;
        } else if (!uiState.location) {
          return (
            <Locating>
              <img src={locating} />
              <Text id="locating" element="p" className="notice" />
            </Locating>
          );
        }
      } else if (!restaurants.length) {
        return (
          <EmptyTextContainer>
            <MdError className="inline-icon" />
            &nbsp;
            <Text id="emptyRestaurants" />
          </EmptyTextContainer>
        );
      }
      return restaurants.map(restaurant => (
        <Restaurant key={restaurant.id} restaurant={restaurant} />
      ));
    }

    render() {
      return (
        <Container>
          <NetworkStatus />
          <ListContainer>{this.renderContent()}</ListContainer>
        </Container>
      );
    }
  }
);
