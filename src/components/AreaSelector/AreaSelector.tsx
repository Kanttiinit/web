import * as sortBy from 'lodash/sortBy';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { MdDirectionsWalk, MdStar } from 'react-icons/md';
import dataContext from '../../contexts/dataContext';
import preferenceContext from '../../contexts/preferencesContext';
import { AreaType } from '../../store/types';
import Button from '../Button';
import Text from '../Text';

const iconStyles = css`
  margin-right: 0.5ch;
  vertical-align: -1px;
`;

const WalkIcon = styled(MdDirectionsWalk)`
  ${iconStyles}
`;

const StarIcon = styled(MdStar)`
  ${iconStyles}
`;

interface SpecialArea {
  id: -1 | -2;
  name: React.ReactNode;
}

const specialAreas: SpecialArea[] = [
  {
    id: -2,
    name: (
      <React.Fragment>
        <WalkIcon />
        <Text id="nearby" />
      </React.Fragment>
    )
  },
  {
    id: -1,
    name: (
      <React.Fragment>
        <StarIcon />
        <Text id="starred" />
      </React.Fragment>
    )
  }
];

const AreaWrapper = styled.div`
  width: 50%;
  box-sizing: border-box;
`;

const AreaButton = styled(Button).attrs({ type: 'text' })<{
  selected: boolean;
}>`
  background-color: ${props =>
    props.selected ? 'var(--gray6)' : 'transparent'};
  color: inherit;
  width: 100%;
  padding: 1em 0.5em;
  border-radius: 4px;
  font-weight: inherit;
  text-align: center;
  outline: none;
  color: ${props => (props.selected ? 'var(--accent_color)' : 'var(--gray1)')};

  &:hover,
  &:focus {
    background: var(--gray5);
  }
`;

const Area = ({
  area,
  selectArea,
  selectedAreaId
}: {
  area: AreaType | SpecialArea;
  selectedAreaId: number;
  selectArea: (id: number) => void;
}) => (
  <AreaWrapper>
    <AreaButton
      onMouseUp={() => selectArea(area.id)}
      selected={selectedAreaId === area.id}
    >
      {area.name}
    </AreaButton>
  </AreaWrapper>
);

interface Props {
  onAreaSelected?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  user-select: none;
  background: var(--gray7);
`;

const AreaSelector = (props: Props & RouteComponentProps<any>) => {
  const data = React.useContext(dataContext);
  const preferences = React.useContext(preferenceContext);

  const selectArea = React.useCallback((areaId: number) => {
    preferences.setSelectedArea(areaId);
    if (props.onAreaSelected) {
      props.onAreaSelected();
    }
  }, []);

  return (
    <Container>
      {specialAreas.map(area => (
        <Area
          key={area.id}
          selectedAreaId={preferences.selectedArea}
          selectArea={selectArea}
          area={area}
        />
      ))}
      {sortBy(data.areas.data, 'name').map((area: AreaType) => (
        <Area
          key={area.id}
          selectedAreaId={preferences.selectedArea}
          selectArea={selectArea}
          area={area}
        />
      ))}
    </Container>
  );
};

export default withRouter(AreaSelector);
