import * as times from 'lodash/times';
import * as React from 'react';
import { MdWarning } from 'react-icons/md';
const locating = require('../../assets/locating.svg');

import styled from 'styled-components';
import { dataContext, preferenceContext, uiContext } from '../../contexts';
import { useFormattedRestaurants, useTranslations } from '../../utils/hooks';
import InlineIcon from '../InlineIcon';
import NetworkStatus from '../NetworkStatus';
import Notice from '../Notice';
import Restaurant, { Placeholder } from '../Restaurant';

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

const ListContent = React.memo(() => {
  const data = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);
  const ui = React.useContext(uiContext);
  const translations = useTranslations();

  const loading =
    data.menus.pending || data.restaurants.pending || data.areas.pending;
  const restaurants = useFormattedRestaurants();

  if (loading) {
    return times(8, (i: number) => <Placeholder key={i} />);
  } else if (preferences.selectedArea === -2) {
    if (!preferences.useLocation) {
      return (
        <Notice>
          <InlineIcon>
            <MdWarning />
          </InlineIcon>{' '}
          {translations.turnOnLocation}
        </Notice>
      );
    } else if (!ui.location) {
      return (
        <Locating>
          <img src={locating} />
          <Notice>{translations.locating}</Notice>
        </Locating>
      );
    }
  } else if (!restaurants.length) {
    return (
      <Notice>
        <InlineIcon>
          <MdWarning />
        </InlineIcon>{' '}
        {translations.emptyRestaurants}
      </Notice>
    );
  }
  return restaurants.map(restaurant => (
    <Restaurant key={restaurant.id} restaurant={restaurant} />
  ));
});

export default () => (
  <Container>
    <NetworkStatus />
    <ListContainer>
      <ListContent />
    </ListContainer>
  </Container>
);
