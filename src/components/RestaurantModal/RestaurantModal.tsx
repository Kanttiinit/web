import * as React from 'react';
import { MdHome, MdPlace } from 'react-icons/md';
import styled from 'styled-components';

import { dataContext, langContext, uiContext } from '../../contexts';
import { RestaurantType } from '../../contexts/types';
import * as api from '../../utils/api';
import { useFormatDate, useTranslations } from '../../utils/hooks';
import InlineIcon from '../InlineIcon';
import MenuViewer from '../MenuViewer';
import PageContainer from '../PageContainer';
import Map from './Map';
import OpeningHours from './OpeningHours';

const Info = styled.div`
  display: flex;
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

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakSmall}) {
    flex-direction: column;
  }
`;

const MetaLink = styled.a`
  text-transform: uppercase;
  display: block;
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
  margin: 0 0.5em 0.5em 0;
  transition: background 0.2s;

  &:hover,
  &:focus {
    background: var(--gray5);
  }

  svg {
    margin-right: 0.5ch;
  }

  @media (max-width: ${props => props.theme.breakSmall}) {
    padding: 0;
  }
`;

interface Props {
  restaurantId: number;
}

const RestaurantModal = (props: Props) => {
  const data = React.useContext(dataContext);
  const { lang } = React.useContext(langContext);
  const translations = useTranslations();
  const formatDate = useFormatDate();
  const ui = React.useContext(uiContext);
  const [restaurant, setRestaurant] = React.useState<RestaurantType>(null);
  const [notFound, setNotFound] = React.useState(false);

  async function fetchRestaurant() {
    let rest = data.restaurants.data.find(
      r => r.id === Number(props.restaurantId)
    );
    if (!rest) {
      const result = await api.getRestaurantsByIds([props.restaurantId], lang);
      if (result.length) {
        rest = result[0];
      } else {
        setNotFound(true);
      }
    }
    setRestaurant(rest);
  }

  React.useEffect(() => {
    fetchRestaurant();
  }, [props.restaurantId]);

  if (notFound) {
    return <PageContainer title={translations.restaurantNotFound} />;
  }
  if (!restaurant) {
    return null;
  }
  return (
    <PageContainer title={restaurant.name}>
      <Info>
        <LinkContainer>
          <MetaLink
            href={`https://maps.google.com/?q=${encodeURIComponent(
              restaurant.address
            )}`}
            rel="noopener"
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
            {translations.homepage}
          </MetaLink>
        </LinkContainer>
        <OpeningHours restaurant={restaurant} />
      </Info>
      <MenuViewer showCopyButton restaurantId={restaurant.id} />
      <Map
        restaurant={restaurant}
        restaurantPoint={[restaurant.latitude, restaurant.longitude]}
        userPoint={
          ui.location
            ? [ui.location.latitude, ui.location.longitude]
            : undefined
        }
      />
    </PageContainer>
  );
};

export default RestaurantModal;
