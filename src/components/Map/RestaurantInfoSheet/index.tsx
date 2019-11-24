import * as React from 'react';
import styled from 'styled-components';
import { RestaurantType } from '../../../contexts/types';
import MenuViewer from '../../MenuViewer';
import OpeningHours from '../../RestaurantModal/OpeningHours';
import InlineIcon from '../../InlineIcon';
import { MdClose } from 'react-icons/md';

export interface Props {
  restaurantData: RestaurantType;
  onClose: () => void;
}

const Container = styled.div`
  position: absolute;
  background: var(--gray7);

  @media (min-width: ${props => props.theme.breakSmall}) {
    top: 48px;
    bottom: 0;
    right: 0;
    width: 400px;
    height: 100%;
  }

  @media (max-width: ${props => props.theme.breakLarge}) {
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    min-height: 200px;
  }
`;

const Content = styled.div`
  @media (min-width: ${props => props.theme.breakSmall}) {
    padding: 1em;
  }

  @media (max-width: ${props => props.theme.breakLarge}) {
    padding: 0.5em;
  }
`;

const IconButton = styled.div`
  cursor: pointer;
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;

  h3 {
    margin: 0;
    margin-bottom: 0.5em;
  }
`;

const RestaurantInfoSheet = ({ restaurantData, onClose }: Props) => {
  return (
    <Container>
      <Content>
        <RestaurantHeader>
          <div>
            <h3>{restaurantData.name}</h3>
            <div>
              <OpeningHours restaurant={restaurantData} />
            </div>
          </div>
          <IconButton onClick={onClose}>
            <InlineIcon>
              <MdClose size={22} />
            </InlineIcon>
          </IconButton>
        </RestaurantHeader>
        <MenuViewer restaurantId={restaurantData.id} />
      </Content>
    </Container>
  );
};

export default RestaurantInfoSheet;
