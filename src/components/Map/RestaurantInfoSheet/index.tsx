import * as React from 'react';
import styled from 'styled-components';
import { RestaurantType } from '../../../contexts/types';
import MenuViewer from '../../MenuViewer';
import OpeningHours from '../../RestaurantModal/OpeningHours';

export interface Props {
  restaurantData: RestaurantType;
}

const Container = styled.div`
  position: absolute;
  top: 48px;
  padding: 1em;
  bottom: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: var(--gray7);
`;

const RestaurantHeader = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: space-between; */

  h3 {
    margin: 0;
    margin-bottom: .5em;
  }
`;

const RestaurantInfoSheet = ({ restaurantData }: Props) => {
  return (
    <Container>
      <RestaurantHeader>
        <h3>{restaurantData.name}</h3>
        <div><OpeningHours restaurant={restaurantData} /></div>
      </RestaurantHeader>
      <MenuViewer restaurantId={restaurantData.id} />
    </Container>
  );
};

export default RestaurantInfoSheet;
