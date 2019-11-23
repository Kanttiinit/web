import * as React from 'react';
import styled from 'styled-components';
import { RestaurantType } from '../../../contexts/types';
import MenuViewer from '../../MenuViewer';

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

const RestaurantInfoSheet = ({ restaurantData }: Props) => {
  return <Container>
    <span style={{color: 'white'}}>{restaurantData.name}</span>
    <MenuViewer restaurantId={restaurantData.id} />
  </Container>;
};

export default RestaurantInfoSheet;
