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
  @keyframes slide-in-right {
    0% {
      -webkit-transform: translateX(1000px);
      transform: translateX(1000px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* animation: slide-in-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; */
  position: absolute;
  top: 48px;
  padding: 1em;
  bottom: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: var(--gray7);
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
    </Container>
  );
};

export default RestaurantInfoSheet;
